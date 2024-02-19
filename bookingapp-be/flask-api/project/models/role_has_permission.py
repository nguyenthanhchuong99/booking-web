from project.models import db

class RoleHasPermission(db.Model):
    __tablename__ = "role_has_permission"
    id = db.Column(db.Integer, primary_key=True)
    role_id = db.Column(db.Integer, db.ForeignKey('role.role_id'))
    permission_id = db.Column(db.Integer, db.ForeignKey('permission.permission_id'))