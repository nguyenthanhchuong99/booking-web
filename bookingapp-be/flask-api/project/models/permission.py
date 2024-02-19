from project.models import db
from sqlalchemy.orm import validates  
from werkzeug.exceptions import BadRequest

class Permission(db.Model):
    """
    Model representing a permission in the database.

    Attributes:
        permission_id (int): The unique identifier for the permission (primary key).
        permission_name (str): The name of the permission, limited to 50 characters.
        role_has_permission (relationship): One-to-many relationship with the 'RoleHasPermission' model,
                                            providing a back reference named 'permission'.
    """
    __tablename__ = "permission"
    permission_id = db.Column(db.Integer, primary_key=True)
    permission_name = db.Column(db.String(50), nullable=False)
    role_has_permission = db.relationship('RoleHasPermission', backref='permission')