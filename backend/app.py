from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from models import db
from routes.auth_routes import auth_bp
from routes.employee_routes import employee_bp
from routes.attendance_routes import attendance_bp
from routes.payroll_routes import payroll_bp
from routes.notification_routes import notification_bp
from routes.dashboard_routes import dashboard_bp
from routes.leave_routes import leave_bp
from routes.settings_routes import settings_bp

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ems.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'super_secret_key_for_session'

CORS(app)

db.init_app(app)
migrate = Migrate(app, db)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(employee_bp, url_prefix='/api/employees')
app.register_blueprint(attendance_bp, url_prefix='/api/attendance')
app.register_blueprint(payroll_bp, url_prefix='/api/payroll')
app.register_blueprint(notification_bp, url_prefix='/api/notifications')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
app.register_blueprint(leave_bp, url_prefix='/api/leaves')
app.register_blueprint(settings_bp, url_prefix='/api/settings')

@app.route('/')
def home():
    return "EMS Backend Running"

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Create tables
    app.run(debug=True, port=5000)
