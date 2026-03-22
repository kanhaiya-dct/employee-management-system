from app import app, db
from models import User, Employee, Attendance, Notification, Payroll
from datetime import datetime, timedelta
import bcrypt

def seed_database():
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        print("Creating users and employees...")
        
        # Create Admin
        admin_password = bcrypt.hashpw(b"admin123", bcrypt.gensalt())
        admin_user = User(
            email="admin@ems.com",
            password=admin_password,
            role="ADMIN",
            is_active=True
        )
        db.session.add(admin_user)
        db.session.flush()
        
        admin_employee = Employee(
            user_id=admin_user.id,
            first_name="System",
            last_name="Admin",
            phone="+1234567890",
            department="Management",
            designation="Administrator",
            joining_date=datetime(2024, 1, 1),
            basic_salary=100000,
            hra=20000,
            allowances=10000,
            is_active=True
        )
        db.session.add(admin_employee)
        
        # Create HR
        hr_password = bcrypt.hashpw(b"hr12345", bcrypt.gensalt())
        hr_user = User(
            email="hr@ems.com",
            password=hr_password,
            role="HR",
            is_active=True
        )
        db.session.add(hr_user)
        db.session.flush()
        
        hr_employee = Employee(
            user_id=hr_user.id,
            first_name="Sarah",
            last_name="Johnson",
            phone="+1234567891",
            department="Human Resources",
            designation="HR Manager",
            joining_date=datetime(2024, 2, 1),
            basic_salary=75000,
            hra=15000,
            allowances=8000,
            is_active=True
        )
        db.session.add(hr_employee)
        
        # Create Sample Employees
        employees_data = [
            ("Kanhaiya", "Garg", "kanhaiyagarg@gmail.com", "+8774874747", "Engineering", "Developer", 50000),
            ("John", "Doe", "john@ems.com", "+1234567892", "Engineering", "Senior Developer", 60000),
            ("Jane", "Smith", "jane@ems.com", "+1234567893", "Marketing", "Marketing Manager", 55000),
        ]
        
        employee_objects = []
        for first, last, email, phone, dept, desig, salary in employees_data:
            emp_password = bcrypt.hashpw(b"ems123", bcrypt.gensalt())
            emp_user = User(
                email=email,
                password=emp_password,
                role="EMPLOYEE",
                is_active=True
            )
            db.session.add(emp_user)
            db.session.flush()
            
            emp = Employee(
                user_id=emp_user.id,
                first_name=first,
                last_name=last,
                phone=phone,
                department=dept,
                designation=desig,
                joining_date=datetime(2024, 1, 15),
                basic_salary=salary,
                hra=salary * 0.2,
                allowances=salary * 0.1,
                is_active=True
            )
            db.session.add(emp)
            employee_objects.append(emp)
        
        db.session.commit()
        
        # Create sample attendance for today
        print("Creating attendance records...")
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        
        for emp in employee_objects:
            attendance = Attendance(
                employee_id=emp.id,
                date=today,
                check_in=datetime.now().replace(hour=9, minute=0),
                status="PRESENT",
                overtime_hours=0,
                late_minutes=0
            )
            db.session.add(attendance)
        
        # Create payroll records for last 3 months
        print("Creating payroll records...")
        all_employees = [admin_employee, hr_employee] + employee_objects
        
        for i in range(3):
            # Calculate month
            month_date = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            month_date = month_date - timedelta(days=i*30)
            
            for emp in all_employees:
                # Calculate salary
                total_salary = emp.basic_salary + emp.hra + emp.allowances
                deductions = total_salary * 0.1  # 10% tax
                net_salary = total_salary - deductions
                
                payroll = Payroll(
                    employee_id=emp.id,
                    month=month_date,
                    basic_salary=emp.basic_salary,
                    allowances=emp.allowances + emp.hra,
                    deductions=deductions,
                    net_salary=net_salary,
                    status="PAID" if i > 0 else "PENDING",  # Current month pending
                    payment_date=month_date + timedelta(days=28) if i > 0 else None
                )
                db.session.add(payroll)
        
        # Create welcome notifications
        print("Creating notifications...")
        for user in User.query.all():
            notif = Notification(
                user_id=user.id,
                title="Welcome to EMS",
                message="Welcome to the Employee Management System!",
                type="SYSTEM",
                is_read=False
            )
            db.session.add(notif)
        
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()

