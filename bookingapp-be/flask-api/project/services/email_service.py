from flask_mail import Message
import os
from project.api.common.constant import DEFAULT_PAGE, DEFAULT_PER_PAGE , MAX_ITEMS_PER_PAGE
from project import mail, app, celery
from project.api.common.base_response import BaseResponse
from project.database.excute.room import RoomExecutor
from project.models import User, Booking
import smtplib


class EmailSender:
    
    @staticmethod
    @celery.task
    def send_email_inviting_join_the_meeting(user_email, title, time_start, time_end, room_name, attendees):
        try:
            with app.app_context():
                msg = Message(f'[LỜI MỜI THAM GIA]: {title}', sender=os.getenv('MAIL_USERNAME'), recipients=[user_email])
                msg.body = f'Thông báo cuộc họp\n\n' \
                        f'Phòng họp: {room_name}\n' \
                        f'Thời gian: {time_start} - {time_end}\n' \
                        f'Người tham gia:\n{",\n".join(attendees)}\n\n' \
                        f'Bạn được thêm vào tham gia cuộc họp. Vào trang lời mời tham gia cuộc họp của mình để xác nhận tham gia.'
                mail.send(msg)
                
        except smtplib.SMTPException as e:
            return BaseResponse.error(e)
         
    @staticmethod   
    @celery.task
    def send_email_accepting_the_scheduled(user_email, title, time_start, time_end, room_name, attendees):
        try:
            with app.app_context():
                msg = Message(f'[XÁC NHẬN]: {title}', sender=os.getenv('MAIL_USERNAME'), recipients=[user_email])
                msg.body = f'Có một cuộc họp đã được chấp nhận!\n\n' \
                           f'Phòng họp: {room_name}\n' \
                           f'Thời gian: {time_start} - {time_end}\n' \
                           f'Người tham gia:\n{",\n".join(attendees)}' 
                mail.send(msg)

        except smtplib.SMTPException as e:
            return BaseResponse.error(e)
        
    @staticmethod
    @celery.task
    def send_email_rejecting_the_scheduled(user_email, title, time_start, time_end, room_name, attendees):
        try:
                msg = Message(f'[TỪ CHỐI]: {title}', sender=os.getenv('MAIL_USERNAME'), recipients=[user_email])
                msg.body = f'Cuộc họp bạn đặt đã bị từ chối!\n\n' \
                           f'Phòng họp: {room_name}\n' \
                           f'Thời gian: {time_start} - {time_end}\n' \
                           f'Người tham gia:\n{",\n".join(attendees)}' 
                mail.send(msg)
        except smtplib.SMTPException as e:
            return BaseResponse.error(e)
    
    @staticmethod
    @celery.task
    def send_mail_reminder(booking: Booking, user: User):
        try:
            with app.app_context():
                attendees=[booking_user.user.user_name for booking_user in booking.booking_user]
                room= RoomExecutor.get_room_by_id(booking.room_id)
                msg = Message(f'[NHẮC NHỞ]: {booking.title}', sender=os.getenv('MAIL_USERNAME'), recipients=[user.email])
                msg.body = f'Thông báo cuộc họp\n\n' \
                           f'Cuộc họp còn 10 phút nữa sẽ bắt đầu!\n\n' \
                           f'Phòng họp: {room.room_name}\n' \
                           f'Thời gian: {booking.time_start} - {booking.time_end}\n' \
                           f'Người tham gia:\n{",\n".join(attendees)}' 
                mail.send(msg)
        except smtplib.SMTPException as e:
            return BaseResponse.error(e)