from project.models import db
from sqlalchemy.orm import validates  
from werkzeug.exceptions import BadRequest

class Role(db.Model):
    """
    Model representing a role in the database.

    Attributes:
        role_id (int): The unique identifier for the role (primary key).
        role_name (str): The name of the role, limited to 50 characters.
        user_has_role (relationship): One-to-many relationship with the 'UserHasRole' model,
                                      providing a back reference named 'role'.
    """
    __tablename__ = "role"
    role_id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(50), nullable=False)
    user_has_role = db.relationship('UserHasRole', backref='role')