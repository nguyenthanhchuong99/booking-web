from project.models import Booking, BookingUser, Room
from typing import List, Optional, Union
from project import db
from flask_jwt_extended import get_jwt_identity
from werkzeug.exceptions import UnprocessableEntity 
from datetime import datetime


class BookingExecutor:
    @staticmethod
    def get_booking(booking_id: int) -> Optional[Booking]:
        return Booking.query.get(booking_id)

    @staticmethod
    def get_bookings_in_date_range(start_date, end_date) -> List[Booking]:
        return Booking.query.filter(
            Booking.is_deleted == False,
            Booking.time_end.between(start_date, end_date)
        ).all()

    @staticmethod
    def check_room_availability(room_id: int, time_start: str, time_end: str) -> Optional[Booking]:
        return Booking.query.filter(
            Booking.room_id == room_id,
            Booking.is_deleted == False,
            Booking.time_end > time_start,
            Booking.time_start < time_end
        ).first()

    @staticmethod
    def create_booking(room_id: int, title: str, time_start: str, time_end: str, user_ids: List[int]) -> Booking:
        user_id = get_jwt_identity()
        try:
            new_booking = Booking(
                room_id=room_id, title=title, time_start=time_start, time_end=time_end, is_accepted=True, is_deleted=False, creator_id=user_id)
            db.session.add(new_booking)
            db.session.commit()

            user_bookings = [
                BookingUser(user_id=id, booking_id=new_booking.booking_id,
                            is_attending=True if id == user_id else None)
                for id in user_ids
            ]

            db.session.add_all(user_bookings)
            db.session.commit()
            return new_booking
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def check_room_availability_update(room_id: int, time_start: str, time_end: str, booking_id: int) -> Optional[Booking]:
        return Booking.query.filter(
            Booking.room_id == room_id,
            Booking.is_deleted == False,
            Booking.time_end > time_start,
            Booking.time_start < time_end,
            Booking.booking_id != booking_id
        ).first()

    @staticmethod
    def update_booking(booking: Booking, room_id: int, title: str, time_start: str, time_end: str, user_ids: List[int]) -> None:
        try:
            booking.room_id = room_id
            booking.title = title
            booking.time_start = time_start
            booking.time_end = time_end

            BookingUser.query.filter_by(booking_id=booking.booking_id).delete()

            for user_id in user_ids:
                user_booking = BookingUser(
                    user_id=user_id, booking_id=booking.booking_id, is_attending=False)
                db.session.add(user_booking)

            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def is_room_blocked(room_id: int) -> Union[bool, None]:
        return Room.query.filter_by(room_id=room_id).value(Room.is_blocked)

    @staticmethod
    def get_bookings_in_date_range_user(start_date, end_date, user_id) -> List[Booking]:
        return Booking.query.join(BookingUser, Booking.booking_id == BookingUser.booking_id).filter(
            Booking.is_deleted == False,
            Booking.time_end.between(start_date, end_date),
            BookingUser.user_id == user_id
        ).all()

    @staticmethod
    def create_booking_belong_to_user(room_id: int, title: str, time_start: str, time_end: str, user_ids: List[int]) -> Booking:
        user_id = get_jwt_identity()
        try:
            new_booking = Booking(
                room_id=room_id, title=title, time_start=time_start, time_end=time_end, is_accepted=False, is_deleted=False, creator_id=user_id)
            db.session.add(new_booking)
            db.session.commit()

            user_bookings = [
                BookingUser(user_id=id, booking_id=new_booking.booking_id,
                            is_attending=True if id == user_id else None)
                for id in user_ids
            ]

            db.session.add_all(user_bookings)
            db.session.commit()
            return new_booking
        except Exception as e:
            db.session.rollback()
            raise UnprocessableEntity(str(e))

    @staticmethod
    def admin_view_booking_pending(page: int, per_page: int) -> List[Booking]:
        bookings = (Booking.query.filter(
            Booking.is_accepted == False, 
            Booking.is_deleted == False,
            Booking.deleted_at == None)
            .order_by(Booking.booking_id.desc())
            .paginate( page=page, per_page=per_page, error_out=False)
        )
        return bookings
    
    @staticmethod
    def user_view_list_booked(page: int, per_page: int, creator_id) -> List[Booking]:
        bookings = (Booking.query.filter(
            Booking.creator_id == creator_id)
            .order_by(Booking.booking_id.desc())
            .paginate(page=page, per_page=per_page, error_out=False)
        )
        return bookings
    
    @staticmethod
    def get_booking_user(booking_id: int, user_id: int) -> Optional[Booking]:
        booking_user = BookingUser.query.join(Booking).filter(
            BookingUser.user_id == user_id,
            BookingUser.booking_id == booking_id,
            Booking.is_deleted == False,
            Booking.is_accepted == True,
            Booking.booking_id == booking_id
        ).first()
        return booking_user
    
    @staticmethod
    def search_booking_room(start_date: str, end_date: str, room_id: int) -> List[Booking]:
        bookings = Booking.query.filter(
            Booking.is_deleted == False,
            Booking.deleted_at == None,
            Booking.time_start >= start_date,
            Booking.time_start <= end_date,
            Booking.room_id == room_id
        ).all()
        return bookings

    @staticmethod    
    def view_list_invite(page: int, per_page: int, user_id: int) -> List[Booking]:
        bookings = (Booking.query.join(BookingUser, Booking.booking_id == BookingUser.booking_id).filter(
            Booking.is_deleted == False,
            Booking.deleted_at == None,
            Booking.is_accepted == True,
            Booking.time_start > datetime.now(),
            BookingUser.user_id == user_id,
            Booking.creator_id != user_id)
        .order_by(Booking.booking_id.desc())
        .paginate(page=page, per_page=per_page, error_out=False)
        )
        return bookings
    
    @staticmethod
    def get_list_meeting_cooming(time_cooming: str):
        bookings = Booking.query.filter(
                Booking.is_deleted == False,
                Booking.deleted_at == None,
                Booking.time_start == (time_cooming)
            ).all()
        return bookings

    @staticmethod 
    def check_attending(booking_id: int, user_id: int):
        booking_user = BookingUser.query.filter(
            BookingUser.booking_id == booking_id,
            BookingUser.user_id == user_id
        ).first()
        return booking_user.is_attending