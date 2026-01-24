from flask import Blueprint, request, jsonify, session
from models import db, User
import bcrypt

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    
    if user and bcrypt.checkpw(password.encode('utf-8'), user.password):
        # In a real app, generate a JWT here. 
        # For simplicity, we use Flask session (requires cookie support on frontend)
        # OR we just return the user data and let frontend handle "session" state 
        # (NextAuth usually handles this, so we might need to adapt NextAuth to use this credentials provider)
        
        return jsonify({
            "user": user.to_dict(),
            "message": "Login successful"
        })
    
    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    user_id = request.headers.get('X-User-ID')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Get user data
    user_data = user.to_dict()
    
    # Include employee data if exists
    from models import Employee
    employee = Employee.query.filter_by(user_id=user_id).first()
    if employee:
        user_data['employee'] = employee.to_dict()
    
    return jsonify(user_data)

