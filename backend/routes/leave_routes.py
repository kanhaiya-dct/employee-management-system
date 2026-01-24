from flask import Blueprint, request, jsonify
from models import db, Leave, Employee
from datetime import datetime

leave_bp = Blueprint('leave', __name__)

@leave_bp.route('', methods=['GET'])
def get_leaves():
    user_id = request.headers.get('X-User-ID')
    status = request.args.get('status')
    
    query = Leave.query
    
    if user_id:
        employee = Employee.query.filter_by(user_id=user_id).first()
        if employee:
            query = query.filter_by(employee_id=employee.id)
    
    if status:
        query = query.filter_by(status=status)
    
    leaves = query.order_by(Leave.created_at.desc()).all()
    
    # Include employee data
    result = []
    for l in leaves:
        leave_dict = {
            "id": l.id,
            "employeeId": l.employee_id,
            "type": l.type,
            "startDate": l.start_date.isoformat(),
            "endDate": l.end_date.isoformat(),
            "reason": l.reason,
            "status": l.status,
            "createdAt": l.created_at.isoformat()
        }
        if l.employee:
            leave_dict["employee"] = l.employee.to_dict()
        result.append(leave_dict)
    
    return jsonify(result)

@leave_bp.route('', methods=['POST'])
def apply_leave():
    data = request.json
    user_id = request.headers.get('X-User-ID')
    
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        employee = Employee.query.filter_by(user_id=user_id).first()
        if not employee:
            return jsonify({"error": "Employee not found"}), 404
        
        new_leave = Leave(
            employee_id=employee.id,
            type=data['type'],
            start_date=datetime.fromisoformat(data['startDate']),
            end_date=datetime.fromisoformat(data['endDate']),
            reason=data['reason'],
            status="PENDING"
        )
        db.session.add(new_leave)
        db.session.commit()
        
        return jsonify({"success": "Leave applied successfully"}), 201
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@leave_bp.route('/<id>', methods=['PUT'])
def update_leave(id):
    data = request.json
    
    try:
        leave = Leave.query.get(id)
        if not leave:
            return jsonify({"error": "Leave not found"}), 404
        
        leave.status = data.get('status', leave.status)
        db.session.commit()
        
        return jsonify({"success": f"Leave {leave.status.lower()}"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
