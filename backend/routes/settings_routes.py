from flask import Blueprint, request, jsonify
from models import db, User, Employee
import bcrypt

settings_bp = Blueprint('settings', __name__)

@settings_bp.route('/password', methods=['PUT'])
def change_password():
    data = request.json
    user_id = request.headers.get('X-User-ID')
    
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        current_password = data.get('currentPassword')
        new_password = data.get('newPassword')
        
        # Verify current password
        if not bcrypt.checkpw(current_password.encode('utf-8'), user.password):
            return jsonify({"error": "Incorrect current password"}), 400
        
        # Hash and update new password
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        user.password = hashed_password
        db.session.commit()
        
        return jsonify({"success": "Password updated successfully"})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@settings_bp.route('/profile', methods=['PUT'])
def update_profile():
    data = request.json
    user_id = request.headers.get('X-User-ID')
    
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        employee = Employee.query.filter_by(user_id=user_id).first()
        if not employee:
            return jsonify({"error": "Employee not found"}), 404
        
        phone = data.get('phone')
        if phone:
            employee.phone = phone
        
        db.session.commit()
        return jsonify({"success": "Profile updated successfully"})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
