from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

def generate_uuid():
    return str(uuid.uuid4())

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    role = db.Column(db.String, default="EMPLOYEE")
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    employee = db.relationship('Employee', backref='user', uselist=False, cascade="all, delete-orphan")
    notifications = db.relationship('Notification', backref='user', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "isActive": self.is_active
        }

class Employee(db.Model):
    __tablename__ = 'employee'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String, db.ForeignKey('user.id'), unique=True, nullable=False)
    
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    phone = db.Column(db.String, nullable=True)
    department = db.Column(db.String, nullable=False)
    designation = db.Column(db.String, nullable=False)
    joining_date = db.Column(db.DateTime, nullable=False)
    profile_image = db.Column(db.String, nullable=True)
    
    basic_salary = db.Column(db.Float, nullable=False)
    hra = db.Column(db.Float, default=0)
    allowances = db.Column(db.Float, default=0)
    
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    attendance = db.relationship('Attendance', backref='employee', lazy=True)
    leaves = db.relationship('Leave', backref='employee', lazy=True)
    payrolls = db.relationship('Payroll', backref='employee', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "phone": self.phone,
            "department": self.department,
            "designation": self.designation,
            "joiningDate": self.joining_date.isoformat() if self.joining_date else None,
            "basicSalary": self.basic_salary,
            "allowances": self.allowances,
            "isActive": self.is_active,
            "user": self.user.to_dict() if self.user else None
        }

class Attendance(db.Model):
    __tablename__ = 'attendance'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    employee_id = db.Column(db.String, db.ForeignKey('employee.id'), nullable=False)
    
    date = db.Column(db.DateTime, nullable=False)
    check_in = db.Column(db.DateTime, nullable=True)
    check_out = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String, nullable=False)
    overtime_hours = db.Column(db.Float, default=0)
    late_minutes = db.Column(db.Integer, default=0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "employeeId": self.employee_id,
            "date": self.date.isoformat(),
            "status": self.status,
            "checkIn": self.check_in.isoformat() if self.check_in else None,
            "checkOut": self.check_out.isoformat() if self.check_out else None
        }

class Leave(db.Model):
    __tablename__ = 'leave'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    employee_id = db.Column(db.String, db.ForeignKey('employee.id'), nullable=False)
    
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    type = db.Column(db.String, nullable=False)
    reason = db.Column(db.String, nullable=False)
    status = db.Column(db.String, default="PENDING")
    
    approved_by = db.Column(db.String, nullable=True)
    rejection_reason = db.Column(db.String, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Payroll(db.Model):
    __tablename__ = 'payroll'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    employee_id = db.Column(db.String, db.ForeignKey('employee.id'), nullable=False)
    
    month = db.Column(db.DateTime, nullable=False)
    basic_salary = db.Column(db.Float, nullable=False)
    allowances = db.Column(db.Float, nullable=False)
    deductions = db.Column(db.Float, default=0)
    net_salary = db.Column(db.Float, nullable=False)
    
    status = db.Column(db.String, default="PENDING")
    payment_date = db.Column(db.DateTime, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "employeeId": self.employee_id,
            "month": self.month.isoformat(),
            "basicSalary": self.basic_salary,
            "allowances": self.allowances,
            "deductions": self.deductions,
            "netSalary": self.net_salary,
            "status": self.status
            # Add employee name if needed by joining
        }

class Notification(db.Model):
    __tablename__ = 'notification'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)
    
    title = db.Column(db.String, nullable=False)
    message = db.Column(db.String, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    type = db.Column(db.String, nullable=False) # e.g., PAYROLL, LEAVE, SYSTEM
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "title": self.title,
            "message": self.message,
            "isRead": self.is_read,
            "createdAt": self.created_at.isoformat()
        }
