from project.models import db

class UserHasRole(db.Model):
    __tablename__ = "user_has_role"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.role_id'))
    