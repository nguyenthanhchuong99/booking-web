from project.models import db
from sqlalchemy.orm import validates
from werkzeug.exceptions import BadRequest
from datetime import datetime


class Booking(db.Model):
    """
    Model representing a booking in the database.

    Attributes:
        booking_id (int): The unique identifier for the booking (primary key).
        title (str): The title or name of the booking, up to 255 characters.
        time_start (datetime): The start time for the booking.
        time_end (datetime): The end time for the booking.
        is_accepted (bool): Indicates whether the booking is accepted or not.
        deleted_at (datetime, optional): Timestamp indicating when the booking was soft-deleted.
        is_deleted (bool): Represents whether the booking is marked as deleted.
        room_id (int): Foreign key reference to the 'room' table, linking the booking to a room.
        booking_user (relationship): One-to-many relationship with the 'BookingUser' model,
                                     providing a back reference named 'booking'.
    """
    __tablename__ = "booking"
    booking_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    time_start = db.Column(db.TIMESTAMP, nullable=False)
    time_end = db.Column(db.TIMESTAMP, nullable=False)
    is_accepted = db.Column(db.Boolean, nullable=False)
    deleted_at = db.Column(db.TIMESTAMP)
    is_deleted = db.Column(db.Boolean, nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('room.room_id'))
    creator_id=db.Column(db.Integer, db.ForeignKey('user.user_id'))
    booking_user = db.relationship('BookingUser', backref='booking')

    def serialize(self):
        return {
            'booking_id': self.booking_id,
            'title': self.title,
            'time_start': self.time_start.strftime('%Y-%m-%d %H:%M:%S'),
            'time_end': self.time_end.strftime('%Y-%m-%d %H:%M:%S'),
            'is_accepted': self.is_accepted,
            'is_deleted': self.is_deleted,
            'room_id': self.room_id,
            'creator_id': self.creator_id,
            'booking_user': [be.serialize() for be in self.booking_user],
            'deleted_at': self.deleted_at
        }

    @staticmethod
    def validate_title(title: str) -> dict[str, str] | None:
        if not title.strip():
            return {"field": "title", "error": "Title cannot be empty or contain only whitespace"}
        elif len(title) > 255:
            return {"field": "title", "error": "Title exceeds maximum length"}
        return None

    @staticmethod
    def validate_time(time_start: str, time_end: str) -> dict[str, str] | None:
        current_time = str(datetime.now())
        if time_start >= time_end:
            return {"field": "time_end", "error": "Time end must be after time start"}
        elif time_start < current_time or time_end < current_time:
            return {"field": "time_start/time_end", "error": "Cannot select time in the past"}
        return None

    def validate_all_fields(self):
        errors = []
        errors.append(self.validate_title(self.title))
        errors.append(self.validate_time(self.time_start, self.time_end))
        errors = [error for error in errors if error is not None]
        return errors
