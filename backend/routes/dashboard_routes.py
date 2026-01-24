from flask import Blueprint, request, jsonify
from models import db, Employee, Attendance, Payroll
from datetime import datetime, timedelta
from sqlalchemy import func

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
def get_dashboard_stats():
    user_id = request.headers.get('X-User-ID')
    
    # If standard Admin request (checking query params or global stats needed)
    # But here we base it on the user role usually.
    # Let's fetch the user to know the role
    from models import User
    current_user = None
    if user_id:
        current_user = User.query.get(user_id)

    # --------------------------
    # ADMIN VIEW (Global Stats)
    # --------------------------
    if current_user and current_user.role == 'ADMIN':
        # Total Staff
        total_staff = Employee.query.filter_by(is_active=True).count()
        
        # Payroll Cost
        employees = Employee.query.filter_by(is_active=True).all()
        payroll_cost = sum(emp.basic_salary + emp.hra + emp.allowances for emp in employees)
        
        # Today's attendance
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        tomorrow = today + timedelta(days=1)
        
        today_attendance = Attendance.query.filter(
            Attendance.date >= today,
            Attendance.date < tomorrow,
            Attendance.status == 'PRESENT'
        ).all()
        
        # Calculate average check-in
        avg_check_in = "N/A"
        if today_attendance:
            total_minutes = 0
            count = 0
            for rec in today_attendance:
                if rec.check_in:
                    total_minutes += rec.check_in.hour * 60 + rec.check_in.minute
                    count += 1
            
            if count > 0:
                avg_minutes = total_minutes / count
                hours = int(avg_minutes // 60)
                mins = int(avg_minutes % 60)
                ampm = 'PM' if hours >= 12 else 'AM'
                formatted_hours = hours % 12 or 12
                avg_check_in = f"{formatted_hours}:{mins:02d} {ampm}"
        
        # On Leave
        on_leave = Attendance.query.filter(
            Attendance.date >= today,
            Attendance.date < tomorrow,
            Attendance.status == 'LEAVE'
        ).count()
        
        return jsonify({
            "role": "ADMIN",
            "totalStaff": total_staff,
            "payrollCost": payroll_cost,
            "avgCheckIn": avg_check_in,
            "onLeave": on_leave
        })

    # --------------------------
    # EMPLOYEE / HR VIEW (Personal Stats)
    # --------------------------
    elif current_user and current_user.employee:
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        tomorrow = today + timedelta(days=1)
        emp = current_user.employee

        # 1. Today's Attendance
        attn_record = Attendance.query.filter(
            Attendance.employee_id == emp.id,
            Attendance.date >= today,
            Attendance.date < tomorrow
        ).first()

        attn_status = "Mark Attendance"
        check_in_time = "--:--"
        
        if attn_record:
            attn_status = attn_record.status.title() # Present, Leave, Half_day
            if attn_record.check_in:
                check_in_time = attn_record.check_in.strftime("%I:%M %p")

        # 2. Leave Balance
        # Assume 24 days total annual leave
        TOTAL_ANNUAL_LEAVE = 24
        
        # Count approved leaves in current year
        current_year = datetime.now().year
        from models import Leave
        approved_leaves = Leave.query.filter(
            Leave.employee_id == emp.id,
            Leave.status == 'APPROVED',
            func.extract('year', Leave.start_date) == current_year
        ).all()
        
        # Calculate days used
        days_used = 0
        for leave in approved_leaves:
            # Simple diff, can be improved to exclude weekends
            duration = (leave.end_date - leave.start_date).days + 1
            days_used += duration
            
        leave_balance = max(0, TOTAL_ANNUAL_LEAVE - days_used)

        return jsonify({
            "role": current_user.role,
            "attendance": {
                "status": attn_status,
                "checkIn": check_in_time
            },
            "leave": {
                "balance": leave_balance,
                "total": TOTAL_ANNUAL_LEAVE,
                "used": days_used
            }
        })
    
    return jsonify({"error": "User not found or role not supported"}), 404

@dashboard_bp.route('/payroll-chart', methods=['GET'])
def get_payroll_chart():
    from datetime import timedelta
    from dateutil.relativedelta import relativedelta
    
    today = datetime.now()
    six_months_ago = today - relativedelta(months=6)
    
    # Get all payrolls from last 6 months
    payrolls = Payroll.query.filter(
        Payroll.month >= six_months_ago
    ).all()
    
    # Group by month
    month_data = {}
    for p in payrolls:
        month_key = p.month.strftime('%Y-%m')
        if month_key not in month_data:
            month_data[month_key] = 0
        month_data[month_key] += float(p.net_salary or 0)
    
    # Create result with month names
    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    result = []
    
    for i in range(6):
        month_date = today - relativedelta(months=5-i)
        month_key = month_date.strftime('%Y-%m')
        month_name = month_names[month_date.month - 1]
        
        result.append({
            "name": month_name,
            "amount": month_data.get(month_key, 0)
        })
    
    return jsonify(result)

@dashboard_bp.route('/attendance-chart', methods=['GET'])
def get_attendance_chart():
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    tomorrow = today + timedelta(days=1)
    
    status_counts = db.session.query(
        Attendance.status,
        func.count(Attendance.status).label('count')
    ).filter(
        Attendance.date >= today,
        Attendance.date < tomorrow
    ).group_by(Attendance.status).all()
    
    chart_data = [
        {"name": "Present", "value": 0, "color": "#06b6d4"},
        {"name": "Absent", "value": 0, "color": "#ef4444"},
        {"name": "Leave", "value": 0, "color": "#a855f7"}
    ]
    
    for status, count in status_counts:
        for item in chart_data:
            if item["name"].upper() == status:
                item["value"] = count
                break
    
    return jsonify(chart_data)
