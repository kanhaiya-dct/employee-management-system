from flask import Blueprint, request, jsonify
from models import db, Attendance, Employee
from datetime import datetime

attendance_bp = Blueprint('attendance', __name__)

@attendance_bp.route('', methods=['GET'])
def get_attendance():
    date_str = request.args.get('date')
    employee_id = request.args.get('employeeId')
    user_id = request.headers.get('X-User-ID')
    limit = request.args.get('limit', type=int)
    
    query = Attendance.query
    
    # Filter by user if provided
    if user_id:
        employee = Employee.query.filter_by(user_id=user_id).first()
        if employee:
            query = query.filter_by(employee_id=employee.id)
    
    if employee_id:
        query = query.filter_by(employee_id=employee_id)
    
    if date_str:
        try:
            date = datetime.fromisoformat(date_str.replace('Z', ''))
            start_of_day = date.replace(hour=0, minute=0, second=0, microsecond=0)
            end_of_day = date.replace(hour=23, minute=59, second=59, microsecond=999999)
            query = query.filter(Attendance.date >= start_of_day, Attendance.date <= end_of_day)
        except:
            pass
    
    query = query.order_by(Attendance.date.desc())
    
    if limit:
        query = query.limit(limit)
    
    records = query.all()
    return jsonify([r.to_dict() for r in records])

@attendance_bp.route('/mark', methods=['POST'])
def mark_attendance():
    data = request.json
    user_id = request.headers.get('X-User-ID')
    
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        # Find employee
        employee = Employee.query.filter_by(user_id=user_id).first()
        if not employee:
            return jsonify({"error": "Employee not found"}), 404
        
        action = data.get('action')
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Check existing attendance
        existing = Attendance.query.filter(
            Attendance.employee_id == employee.id,
            Attendance.date >= today,
            Attendance.date < today.replace(hour=23, minute=59, second=59)
        ).first()
        
        if action == "CHECK_IN":
            if existing:
                return jsonify({"error": "Already checked in today"}), 400
            
            # Late detection
            now = datetime.now()
            start_work = now.replace(hour=9, minute=30, second=0, microsecond=0)
            
            status = "PRESENT"
            late_minutes = 0
            
            if now > start_work:
                diff = (now - start_work).total_seconds() / 60
                late_minutes = int(diff)
                if late_minutes > 60:  # More than 1 hour late
                    status = "HALF_DAY"
            
            new_record = Attendance(
                employee_id=employee.id,
                date=today,
                check_in=now,
                status=status,
                late_minutes=late_minutes
            )
            db.session.add(new_record)
            db.session.commit()
            
            return jsonify({"success": "Checked in successfully"}), 201
            
        elif action == "CHECK_OUT":
            if not existing:
                return jsonify({"error": "You have not checked in yet"}), 400
            
            if existing.check_out:
                return jsonify({"error": "Already checked out"}), 400
            
            existing.check_out = datetime.now()
            db.session.commit()
            
            return jsonify({"success": "Checked out successfully"})
        
        return jsonify({"error": "Invalid action"}), 400
        
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
