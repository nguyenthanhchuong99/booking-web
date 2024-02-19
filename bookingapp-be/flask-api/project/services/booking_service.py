from project.database.excute.booking import BookingExecutor
from project.database.excute.user import UserExecutor
from project.services.email_service import EmailSender
from project.models import Room, Booking, User
from project.api.common.base_response import BaseResponse
from werkzeug.exceptions import BadRequest, InternalServerError, Conflict, NotFound, UnprocessableEntity
from flask import request
from datetime import datetime, timedelta
from typing import List
from project.database.excute.room import RoomExecutor
from typing import Union, Dict, Optional, List
from math import ceil
from flask_jwt_extended import get_jwt_identity
from project import db
from project.services.notification_service import PushNotification
from project.api.common.constant import DEFAULT_PAGE, DEFAULT_PER_PAGE , MAX_ITEMS_PER_PAGE

class BookingService:
    
    @staticmethod
    def show_list_booking(bookings: List[Booking]):
        list_bookings = []
        for booking in bookings:
            user_ids = [booking_user.user.user_id for booking_user in booking.booking_user]
            user_names = [booking_user.user.user_name for booking_user in booking.booking_user]
            booking_users = [booking_user.serialize() for booking_user in booking.booking_user]
            user_created= User.query.filter_by(user_id=booking.creator_id).first()
            creator_name=user_created.user_name if user_created else None
            room = Room.query.filter_by(room_id=booking.room_id).first()
            room_name = room.room_name if room else None
            
            booking_info = {
                "booking_id": booking.booking_id,
                "title": booking.title,
                "time_start": booking.time_start.strftime('%Y-%m-%d %H:%M:%S'),
                "time_end": booking.time_end.strftime('%Y-%m-%d %H:%M:%S'),
                "room_id": booking.room_id,
                "room_name": room_name,
                "user_ids": user_ids,  
                "user_names": user_names,
                "creator_id": booking.creator_id,
                "creator_name": creator_name,
                "is_accepted":booking.is_accepted,
                "is_deleted":booking.is_deleted,
                "booking_users":booking_users
            }
            list_bookings.append(booking_info) 
        return list_bookings

    @staticmethod
    def get_bookings_in_date_range() -> dict:
        start_date_str = request.args.get('start_date', None)
        end_date_str = request.args.get('end_date', None)

        if start_date_str and end_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(
                end_date_str, '%Y-%m-%d') + timedelta(days=1)
        else:
            raise BadRequest(
                "Both start_date and end_date are required for date range query.")

        bookings = BookingExecutor.get_bookings_in_date_range(
            start_date, end_date)

        list_bookings = BookingService.show_list_booking(bookings)
        return list_bookings

    @staticmethod
    def get_bookings_in_date_range_user() -> dict:
        user_id = get_jwt_identity()
        start_date_str = request.args.get('start_date', None)
        end_date_str = request.args.get('end_date', None)

        if start_date_str and end_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(
                end_date_str, '%Y-%m-%d') + timedelta(days=1)
        else:
            raise BadRequest(
                "Both start_date and end_date are required for date range query.")

        bookings = BookingExecutor.get_bookings_in_date_range_user(
            start_date, end_date, user_id)
        list_bookings = BookingService.show_list_booking(bookings)
        return list_bookings

    @staticmethod
    def book_room(data:  Dict):
        room_id = data.get('room_id')
        title = data.get('title')
        time_start = data.get('time_start')
        time_end = data.get('time_end')
        user_ids = data.get('user_ids', [])

        errors = []
        validate_title = Booking.validate_title(title)
        if validate_title:
            errors.append(validate_title)

        validate_time = Booking.validate_time(time_start, time_end)
        if validate_time:
            errors.append(validate_time)
        if errors:
            return BaseResponse.error_validate(errors)

        existing_booking: Optional[Booking] = BookingExecutor.check_room_availability(
            room_id, time_start, time_end)

        if existing_booking:
            raise Conflict('Room is already booked for this time')
        else:
            new_booking = BookingExecutor.create_booking(
                room_id, title, time_start, time_end, user_ids)
            BookingService.send_email_inviting_join_the_meeting(
                new_booking, user_ids)
            BookingService.push_notification(booking=new_booking)
        return BaseResponse.success(message='Booking created successfully')
    
    @staticmethod
    def push_notification(booking: Booking):
        users = []
        users.extend([booking_user.user for booking_user in booking.booking_user])  
        for user in users:
            if user.fcm_token:
                PushNotification.send_notification_reminder(
                    fcm_token = user.fcm_token,
                    message_title = "Successful Booking",
                    message_body = f"The {booking.title} is booking by admin ")

    @staticmethod
    def send_email_inviting_join_the_meeting(new_booking: Booking, user_ids: List[int]):
        for user_id in user_ids:
            user_email = UserExecutor.get_user_email_by_id(user_id)
            title = new_booking.title
            time_start = new_booking.time_start
            time_end = new_booking.time_end
            room_name = new_booking.room.room_name
            attendees = [
                booking_user.user.user_name for booking_user in new_booking.booking_user]
            EmailSender.send_email_inviting_join_the_meeting(
                user_email, title, time_start, time_end, room_name, attendees)

    @staticmethod
    def update_booking(booking_id: int, data: Dict) -> Union[Dict, None]:
        room_id: int = data.get('room_id')
        title: str = data.get('title')
        time_start: str = data.get('time_start')
        time_end: str = data.get('time_end')
        user_ids: List[int] = data.get('user_ids', [])

        booking = BookingExecutor.get_booking(booking_id)

        if not booking:
            raise NotFound('Booking not found')

        errors = []
        validate_title = Booking.validate_title(title)
        if validate_title:
            errors.append(validate_title)

        validate_time = Booking.validate_time(time_start, time_end)
        if validate_time:
            errors.append(validate_time)

        if errors:
            return BaseResponse.error_validate(errors)

        existing_booking = BookingExecutor.check_room_availability_update(
            room_id, time_start, time_end, booking_id)

        if existing_booking:
            raise Conflict('Room is already booked for this time')

        BookingExecutor.update_booking(
            booking, room_id, title, time_start, time_end, user_ids,)

        return BaseResponse.success(message='Booking updated successfully')

    @staticmethod
    def delete_booking_service(booking_id: int) -> Dict:
        booking = Booking.query.get(booking_id)

        if not booking:
            raise NotFound('Booking not found')

        if booking.is_deleted:
            raise BadRequest('Booking is already deleted')

        room_status = BookingExecutor.is_room_blocked(booking.room_id)

        if room_status:
            raise BadRequest(
                'Cannot delete the booking, the room is currently in use')

        booking.is_deleted = True
        booking.deleted_at = datetime.now()

        db.session.commit()
        return BaseResponse.success(message='Booking deleted successfully')

    @staticmethod
    def accept_booking(booking_id: int):
        booking = BookingExecutor.get_booking(booking_id)
        try:
            booking.is_accepted = True
            booking.is_deleted = False
            booking.deleted_at = None
            users = [user.user for user in booking.booking_user]
            db.session.commit()
            BookingService.send_email_accepting_the_scheduled(
                booking, users)
            return BaseResponse.success(message='Booking accepted successfully')

        except Exception as e:
            db.session.rollback()
            raise InternalServerError(str(e))

    @staticmethod
    def send_email_accepting_the_scheduled(booking: Booking, users: List[User]):
        title = booking.title
        time_start = booking.time_start
        time_end = booking.time_end
        room_name = booking.room.room_name
        attendees = [
                booking_user.user.user_name for booking_user in booking.booking_user]
        for user in users:
            if user.user_id == booking.creator_id:
                EmailSender.send_email_accepting_the_scheduled(
                    user.email, title, time_start, time_end, room_name, attendees)
                if user.fcm_token:
                    PushNotification.send_notification_reminder(
                        fcm_token=user.fcm_token,
                        message_title="Booking Accepted",
                        message_body=f"The booking '{booking.title}' scheduled for {
                            booking.time_start} - {booking.time_end} has been accepted."
                    )

            else:
                EmailSender.send_email_inviting_join_the_meeting(
                    user.email, title, time_start, time_end, room_name, attendees)
                if user.fcm_token:
                    PushNotification.send_notification_reminder(
                        fcm_token = user.fcm_token,
                        message_title = "Notification: Meeting invite",
                        message_body = f"You are added to {title} "
                    )

    @staticmethod
    def book_room_belong_to_user(data:  Dict):
        room_id = data.get('room_id')
        title = data.get('title')
        time_start = data.get('time_start')
        time_end = data.get('time_end')
        user_ids = data.get('user_ids', [])

        errors = []
        validate_title = Booking.validate_title(title)
        if validate_title:
            errors.append(validate_title)

        validate_time = Booking.validate_time(time_start, time_end)
        if validate_time:
            errors.append(validate_time)
        if errors:
            return BaseResponse.error_validate(errors)

        existing_booking: Optional[Booking] = BookingExecutor.check_room_availability(
            room_id, time_start, time_end)

        if existing_booking:
            raise Conflict('Room is already booked for this time')
        else:
            new_booking = BookingExecutor.create_booking_belong_to_user(
                room_id, title, time_start, time_end, user_ids)
        admins = UserExecutor.get_list_user_by_role_name(role_name="admin")
        if not admins:
            raise NotFound('Admins not found')
        creator = UserExecutor.get_user(user_id=new_booking.creator_id)

        for admin in admins:
            if admin.fcm_token:
                PushNotification.send_notification_reminder(
                    fcm_token=admin.fcm_token,
                    message_title="Meeting pending",
                    message_body=f"There is a meeting schedule set by {creator.user_name}")
        return BaseResponse.success(message='Booking created successfully')

    @staticmethod
    def reject_booking(booking_id: int):
        booking = BookingExecutor.get_booking(booking_id)
        try:
            booking.is_accepted = False
            booking.is_deleted = True
            booking.deleted_at = datetime.now()
            user_ids = [user.user_id for user in booking.booking_user]
            BookingService.send_email_rejecting_the_scheduled(
                booking, user_ids)

            if booking.creator_id:
                user = UserExecutor.get_user(user_id=booking.creator_id)
                if user and user.fcm_token:
                    PushNotification.send_notification_reminder(
                        fcm_token=user.fcm_token,
                        message_title="Booking Rejected",
                        message_body=f"The booking '{booking.title}' scheduled for {
                            booking.time_start} - {booking.time_end} has been rejected."
                    )
            else:
                raise NotFound('Creator not found')

            db.session.commit()

            return BaseResponse.success(message='Booking rejected successfully')

        except Exception as e:
            db.session.rollback()
            raise UnprocessableEntity(e)

    @staticmethod
    def send_email_rejecting_the_scheduled(booking: Booking, user_ids: List[int]):
        for user_id in user_ids:
            user_email = UserExecutor.get_user_email_by_id(user_id)
            title = booking.title
            time_start = booking.time_start
            time_end = booking.time_end
            room_name = booking.room.room_name
            attendees = [
                booking_user.user.user_name for booking_user in booking.booking_user]

            if user_id == booking.creator_id:
                EmailSender.send_email_rejecting_the_scheduled(
                    user_email, title, time_start, time_end, room_name, attendees)

    @staticmethod
    def view_list_invite() -> list[Booking]:
        user_id = get_jwt_identity()
        page = int(request.args.get('page', DEFAULT_PAGE))
        per_page = int(request.args.get('per_page', DEFAULT_PER_PAGE))
        if per_page == -1:
            per_page = MAX_ITEMS_PER_PAGE

        bookings = BookingExecutor.view_list_invite(page, per_page, user_id)
        list_booking_invite = BookingService.show_list_booking(bookings)
        total_items = bookings.total
        total_pages = ceil(total_items / per_page)
        per_page = per_page
        current_page = page
        result = {
            'list_bookings': list_booking_invite,
            'total_items': total_items,
            'per_page': per_page,
            'current_page': current_page,
            'total_pages': total_pages
        }
        return result

    @staticmethod
    def admin_view_booking_pending() -> List[Booking]:
        page = int(request.args.get('page', DEFAULT_PAGE))
        per_page = int(request.args.get('per_page', DEFAULT_PER_PAGE))
        if per_page == -1:
            per_page = MAX_ITEMS_PER_PAGE

        bookings=BookingExecutor.admin_view_booking_pending(page, per_page)
        list_bookings=BookingService.show_list_booking(bookings)  
        total_items = bookings.total
        total_pages = ceil(total_items / per_page)
        per_page = per_page
        current_page = page
        result = {
            'list_bookings': list_bookings,
            'total_items': total_items,
            'per_page': per_page,
            'current_page': current_page,
            'total_pages': total_pages
        }
        return result

    @staticmethod
    def user_view_list_booked() -> List[Booking]:
        creator_id=get_jwt_identity()
        page = int(request.args.get('page', DEFAULT_PAGE))
        per_page = int(request.args.get('per_page', DEFAULT_PER_PAGE))
        if per_page == -1:
            per_page = MAX_ITEMS_PER_PAGE

        bookings=BookingExecutor.user_view_list_booked(page, per_page, creator_id)
        list_bookings = BookingService.show_list_booking(bookings)   
        total_items = bookings.total
        total_pages = ceil(total_items / per_page)
        per_page = per_page
        current_page = page
        result = {
            'list_bookings': list_bookings,
            'total_items': total_items,
            'per_page': per_page,
            'current_page': current_page,
            'total_pages': total_pages
        }
        return result

    @staticmethod
    def user_decline_booking(booking_id: int):
        user_id = get_jwt_identity()
        booking_user = BookingExecutor.get_booking_user(booking_id, user_id)
        try:
            booking_user.is_attending = False
            db.session.commit()
            booking = BookingExecutor.get_booking(booking_id)
            creator = UserExecutor.get_user(user_id=booking.creator_id)
            user=UserExecutor.get_user(user_id)
            if creator.fcm_token:
                PushNotification.send_notification_reminder(
                            fcm_token=creator.fcm_token,
                            message_title="Invitation confirme",
                            message_body=f"{user.user_name} decline participation in meeting schedule"
                        )
            return BaseResponse.success(message='Invitation successfully declined')

        except Exception as e:
            db.session.rollback()
            raise UnprocessableEntity(str(e))

    @staticmethod
    def user_confirm_booking(booking_id: int):
        user_id = get_jwt_identity()
        booking_user = BookingExecutor.get_booking_user(booking_id, user_id)
        try:
            booking_user.is_attending = True
            db.session.commit()
            booking = BookingExecutor.get_booking(booking_id)
            creator = UserExecutor.get_user(user_id=booking.creator_id)
            user=UserExecutor.get_user(user_id)
            if creator.fcm_token:
                PushNotification.send_notification_reminder(
                            fcm_token=creator.fcm_token,
                            message_title="Invitation confirme",
                            message_body=f"{user.user_name} confirm participation in meeting schedule")
            return BaseResponse.success(message='Invitation successfully confirmed')

        except Exception as e:
            db.session.rollback()
            raise UnprocessableEntity(str(e))

    @staticmethod
    def detail_booking(booking_id: int):
        booking = BookingExecutor.get_booking(booking_id)
        if not booking:
            raise NotFound('Booking not found')
        user_ids = [
            booking_user.user.user_id for booking_user in booking.booking_user]
        user_names = [
            booking_user.user.user_name for booking_user in booking.booking_user]

        user_created = User.query.filter_by(user_id=booking.creator_id).first()
        creator_name = user_created.user_name if user_created else None

        room = RoomExecutor.get_room_by_id(booking.room_id)
        room_name = room.room_name if room else None

        booking_info = {
            "booking_id": booking.booking_id,
            "title": booking.title,
            "time_start": booking.time_start.strftime('%Y-%m-%d %H:%M:%S'),
            "time_end": booking.time_end.strftime('%Y-%m-%d %H:%M:%S'),
            "room_id": booking.room_id,
            "room_name": room_name,
            "user_ids": user_ids,
            "user_names": user_names,
            "creator_id": booking.creator_id,
            "creator_name": creator_name,
            "is_accepted": booking.is_accepted,
            "is_deleted": booking.is_deleted
        }
        return booking_info

    @staticmethod
    def search_booking_room(room_id: int) -> List[Booking]:

        start_date_str = request.args.get('start_date', None)
        end_date_str = request.args.get('end_date', None)

        if start_date_str and end_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(
                end_date_str, '%Y-%m-%d') + timedelta(days=1)
        else:
            raise BadRequest(
                "Both start_date and end_date are required for date range query.")

        bookings = BookingExecutor.search_booking_room(
            start_date, end_date, room_id)
        list_bookings = BookingService.show_list_booking(bookings)
        return list_bookings

    