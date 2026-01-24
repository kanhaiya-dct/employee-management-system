from flask import Blueprint, request, jsonify
from models import db, Notification

notification_bp = Blueprint('notification', __name__)

@notification_bp.route('', methods=['GET'])
def get_notifications():
    user_id = request.headers.get('X-User-ID')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
        
    notifs = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    return jsonify([n.to_dict() for n in notifs])

@notification_bp.route('/<id>/read', methods=['PUT'])
def mark_read(id):
    notif = Notification.query.get(id)
    if notif:
        notif.is_read = True
        db.session.commit()
        return jsonify({"success": "Marked as read"})
    return jsonify({"error": "Not found"}), 404

@notification_bp.route('/read-all', methods=['PUT'])
def mark_all_read():
    user_id = request.headers.get('X-User-ID')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
        
    Notification.query.filter_by(user_id=user_id, is_read=False).update({"is_read": True})
    db.session.commit()
    return jsonify({"success": "All marked as read"})
