from flask import Blueprint, request, jsonify
from models import db, Payroll, Employee, Attendance, Notification, User
from datetime import datetime
import calendar

payroll_bp = Blueprint('payroll', __name__)

@payroll_bp.route('/generate', methods=['POST'])
def generate_payroll():
    data = request.json
    user_id = request.headers.get('X-User-ID')
    employee_id = data.get('employeeId')
    month_str = data.get('month') # YYYY-MM

    if not employee_id or not month_str:
        return jsonify({"error": "Missing fields"}), 400
    
    # Fetch employee first as it's needed for both permissions and payroll creation
    employee = Employee.query.get(employee_id)
    if not employee:
        return jsonify({"error": "Employee not found"}), 404
    
    # Get current user and verify permissions
    if user_id:
        current_user = User.query.get(user_id)
        
        # Check permissions based on role
        if current_user:
            if current_user.role == 'ADMIN':
                # Admin can generate for Employees and HR only
                if employee.user.role not in ['EMPLOYEE', 'HR']:
                    return jsonify({"error": "Cannot generate payroll for Admin users"}), 403
            elif current_user.role == 'HR':
                # HR can generate for Employees only
                if employee.user.role != 'EMPLOYEE':
                    return jsonify({"error": "HR can only generate payroll for Employees"}), 403
            else:
                # Regular employees cannot generate payroll
                return jsonify({"error": "You don't have permission to generate payroll"}), 403

    try:
        year, month = map(int, month_str.split('-'))
        start_date = datetime(year, month, 1)
        _, last_day = calendar.monthrange(year, month)
        end_date = datetime(year, month, last_day, 23, 59, 59)

        # Calculate Attendance
        attendance_records = Attendance.query.filter(
            Attendance.employee_id == employee_id,
            Attendance.date >= start_date,
            Attendance.date <= end_date
        ).all()

        present_days = len([r for r in attendance_records if r.status == 'PRESENT'])
        half_days = len([r for r in attendance_records if r.status == 'HALF_DAY'])
        
        total_effective_days = present_days + (half_days * 0.5)
        daily_rate = employee.basic_salary / 30 
        
        calculated_salary = daily_rate * total_effective_days + employee.allowances
        deductions = calculated_salary * 0.1
        net_salary = calculated_salary - deductions

        # Create Payroll
        payroll = Payroll(
            employee_id=employee.id,
            month=start_date,
            basic_salary=employee.basic_salary,
            allowances=employee.allowances,
            deductions=deductions,
            net_salary=net_salary,
            status="PENDING"
        )
        db.session.add(payroll)
        
        # Create Notification
        notif = Notification(
            user_id=employee.user_id,
            title="Payroll Generated",
            message=f"Your salary for {month_str} has been processed.",
            type="PAYROLL"
        )
        db.session.add(notif)
        
        db.session.commit()
        return jsonify({"success": f"Payroll generated: ${net_salary:.2f}"})

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@payroll_bp.route('', methods=['GET'])
def get_payrolls():
    user_id = request.headers.get('X-User-ID')
    query = request.args.get('query', '')
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('pageSize', 10))
    
    # Build query with role-based filtering
    payroll_query = Payroll.query.join(Employee).join(User)
    
    # Role-based filtering
    if user_id:
        current_user = User.query.get(user_id)
        
        if current_user:
            if current_user.role == 'ADMIN':
                # Admin can see payroll for Employees + HR
                payroll_query = payroll_query.filter(User.role.in_(['EMPLOYEE', 'HR']))
            elif current_user.role == 'HR':
                # HR can see payroll for Employees only
                payroll_query = payroll_query.filter(User.role == 'EMPLOYEE')
            else:
                # Employees see only their own payroll
                employee = Employee.query.filter_by(user_id=user_id).first()
                if employee:
                    payroll_query = payroll_query.filter(Payroll.employee_id == employee.id)
                else:
                    # No employee record, return empty
                    return jsonify({'payrolls': [], 'total': 0})
    
    # Search filter
    if query:
        payroll_query = payroll_query.filter(
            db.or_(
                Employee.first_name.contains(query),
                Employee.last_name.contains(query),
                Payroll.status.contains(query)
            )
        )
    
    # Pagination
    total = payroll_query.count()
    payrolls = payroll_query.order_by(Payroll.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    
    # Include employee data
    result = []
    for p in payrolls:
        payroll_dict = p.to_dict()
        payroll_dict['employee'] = p.employee.to_dict() if p.employee else None
        result.append(payroll_dict)
    
    return jsonify({
        'payrolls': result,
        'total': total
    })

@payroll_bp.route('/<id>/approve', methods=['PUT'])
def approve_payroll(id):
    try:
        payroll = Payroll.query.get(id)
        if not payroll:
            return jsonify({"error": "Payroll not found"}), 404
        
        payroll.status = 'PAID'
        payroll.payment_date = datetime.now()
        db.session.commit()
        
        return jsonify({"success": "Payroll approved"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

