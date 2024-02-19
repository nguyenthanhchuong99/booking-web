import re
from project.models import db
from flask_bcrypt import bcrypt
from sqlalchemy.orm import validates
from werkzeug.exceptions import BadRequest


class User(db.Model):
    """
    Model representing a user in the database.

    Attributes:
        user_id (int): The unique identifier for the user (primary key).
        user_name (str): The name of the user, limited to 50 characters.
        email (str): The email address of the user, unique and up to 50 characters.
        phone_number (str): The phone number of the user, unique and 11 characters long.
        password (str): The hashed password of the user, up to 255 characters.
        created_at (datetime): Timestamp indicating when the user account was created.
        updated_at (datetime): Timestamp indicating when the user account was last updated.
        is_deleted (bool): Represents whether the user account is marked as deleted.
        booking_user (relationship): One-to-many relationship with the 'BookingUser' model,
                                    providing a back reference named 'user'.
        user_has_role (relationship): One-to-many relationship with the 'UserHasRole' model,
                                      providing a back reference named 'user'.
    """
    __tablename__ = "user"
    user_id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    phone_number = db.Column(db.String(11), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.TIMESTAMP, nullable=False)
    updated_at = db.Column(db.TIMESTAMP, nullable=False)
    is_deleted = db.Column(db.Boolean, nullable=False)
    fcm_token = db.Column(db.String(255), nullable=True)
    booking = db.relationship('Booking', backref='user')
    booking_user = db.relationship('BookingUser', backref='user')
    user_has_role = db.relationship('UserHasRole', backref='user')

    def set_password(self, password):
        self.password = bcrypt.hashpw(password.encode(
            'utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

    def serialize(self):
        return {
            'user_id': self.user_id,
            'user_name': self.user_name,
            'email': self.email,
            'phone_number': self.phone_number,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'is_deleted': self.is_deleted,
            'fcm_token': self.fcm_token,
            'bookings': [booking.serialize() for booking in self.booking_user],
            'roles': [role.serialize() for role in self.user_has_role]
        }

    @staticmethod
    def validate_user_name(user_name: str) -> dict[str, str] | None:
        if not user_name.strip():
            return {"field": "user_name", "error": "User name cannot be empty or contain only whitespace"}
        elif len(user_name) > 50:
            return {"field": "user_name", "error": "User name exceeds maximum length"}
        return None

    @staticmethod
    def validate_email(email: str) -> dict[str, str] | None:
        if not email.strip():
            return {"field": "email", "error": "Email cannot be empty or contain only whitespace"}
        elif not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            return {"field": "email", "error": "Format email must be: example@example.com)"}
        return None

    @staticmethod
    def validate_phone_number(phone_number: str) -> dict[str, str] | None:
        if not phone_number.strip():
            return {"field": "phone_number", "error": "Phone number cannot be empty or contain only whitespace"}
        elif not re.match(r'^0\d{9}$', phone_number):
            return {"field": "phone_number", "error": "Phone number must be have 10 number and format: 0*********"}
        return None

    @staticmethod
    def validate_password(password: str) -> dict[str, str] | None:
        if not password.strip():
            return {"field": "password", "error": "Password cannot be empty or contain only whitespace"}
        elif not re.match(r'^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$', password):
            return {"field": "password", "error": "Password must be at least 8 characters, at least one letter and at least one number"}
        return None

    def validate_all_fields(self):
        errors = []
        errors.append(self.validate_user_name(self.user_name))
        errors.append(self.validate_email(self.email))
        errors.append(self.validate_phone_number(self.phone_number))
        errors.append(self.validate_password(self.password))
        errors = [error for error in errors if error is not None]
        return errors
