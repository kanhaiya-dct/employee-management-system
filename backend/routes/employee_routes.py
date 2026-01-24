from flask import Blueprint, request, jsonify
from models import db, Employee, User
from datetime import datetime
import bcrypt

employee_bp = Blueprint('employee', __name__)

@employee_bp.route('', methods=['GET'])
def get_employees():
    user_id = request.headers.get('X-User-ID')
    
    # Get current user's role
    current_user = None
    if user_id:
        current_user = User.query.get(user_id)
    
    # Build query based on role
    if current_user:
        if current_user.role == 'ADMIN':
            # Admin can see Employees + HR (exclude other Admins)
            employees = Employee.query.join(User).filter(
                User.role.in_(['EMPLOYEE', 'HR'])
            ).all()
        elif current_user.role == 'HR':
            # HR can see only Employees (not HR or Admin)
            employees = Employee.query.join(User).filter(
                User.role == 'EMPLOYEE'
            ).all()
        else:
            # Regular employees shouldn't generate payroll for others
            employees = []
    else:
        # No user context, return all (for backward compatibility)
        employees = Employee.query.all()
    
    return jsonify([emp.to_dict() for emp in employees])

@employee_bp.route('', methods=['POST'])
def create_employee():
    data = request.json
    try:
        # Create User first
        hashed_password = bcrypt.hashpw(b"ems123", bcrypt.gensalt())
        new_user = User(
            email=data['email'],
            password=hashed_password,
            role=data.get('role', 'EMPLOYEE')
        )
        db.session.add(new_user)
        db.session.flush() # Get ID

        new_employee = Employee(
            user_id=new_user.id,
            first_name=data['firstName'],
            last_name=data['lastName'],
            phone=data.get('phone'),
            department=data['department'],
            designation=data['designation'],
            joining_date=datetime.fromisoformat(data['joiningDate'].replace('Z', '')),
            basic_salary=float(data['basicSalary'])
        )
        db.session.add(new_employee)
        db.session.commit()
        
        return jsonify({"success": "Employee created"}), 201
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"error": str(e)}), 500

@employee_bp.route('/<id>', methods=['GET'])
def get_employee(id):
    emp = Employee.query.get(id)
    if not emp:
        return jsonify({"error": "Not found"}), 404
    return jsonify(emp.to_dict())

@employee_bp.route('/<id>', methods=['PUT'])
def update_employee(id):
    data = request.json
    emp = Employee.query.get(id)
    if not emp:
         return jsonify({"error": "Not found"}), 404
         
    try:
        emp.first_name = data.get('firstName', emp.first_name)
        emp.last_name = data.get('lastName', emp.last_name)
        emp.phone = data.get('phone', emp.phone)
        emp.department = data.get('department', emp.department)
        emp.designation = data.get('designation', emp.designation)
        emp.basic_salary = float(data.get('basicSalary', emp.basic_salary))
        if 'joiningDate' in data:
             emp.joining_date = datetime.fromisoformat(data['joiningDate'].replace('Z', ''))
        
        # Update User role/email if needed
        if 'role' in data and emp.user:
            emp.user.role = data['role']
        if 'email' in data and emp.user:
            emp.user.email = data['email']
            
        db.session.commit()
        return jsonify({"success": "Employee updated"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@employee_bp.route('/<id>', methods=['DELETE'])
def delete_employee(id):
    emp = Employee.query.get(id)
    if not emp:
        return jsonify({"error": "Not found"}), 404
        
    try:
        # Cascade delete is configured? If not, manually delete user
        user = emp.user
        db.session.delete(emp)
        if user:
            db.session.delete(user)
        db.session.commit()
        return jsonify({"success": "Employee deleted"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
