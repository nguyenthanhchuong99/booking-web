from project.models import db

class BookingUser(db.Model):
    """
    Model representing a booking associated with a user in the database.

    Attributes:
        id (int): The unique identifier for the booking-user relationship (primary key).
        booking_id (int): Foreign key reference to the 'booking' table, linking the booking.
        is_attending (bool): Indicates whether the user is attending the booking or not.
        user_id (int): Foreign key reference to the 'user' table, linking the user.
    """
    __tablename__ = "booking_user"
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.booking_id'))
    is_attending = db.Column(db.Boolean, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))

    def serialize(self):
        return {
            'id': self.id,
            'booking_id': self.booking_id,
            'user_id': self.user_id,
            'is_attending': self.is_attending
        }