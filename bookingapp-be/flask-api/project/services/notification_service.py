from project import app, push_service, scheduler
from project.database.excute.booking import BookingExecutor
from datetime import datetime, timedelta
from project.services.email_service import EmailSender


class PushNotification:

    @staticmethod
    def send_notification_reminder(fcm_token: str, message_title: str, message_body: str ):
        push_service.notify_single_device(
            registration_id=fcm_token, 
            message_title=message_title, 
            message_body=message_body)
        
    @staticmethod
    @scheduler.task( trigger="cron", id="interval_1",minute="*")
    def scheduled_send():
        with app.app_context():
            current_time = datetime.now().replace(second=0, microsecond=0)
            time_coming = current_time + timedelta(minutes=10)
            bookings = BookingExecutor.get_list_meeting_cooming(time_coming)

            if bookings:
                users = []
                for booking in bookings:
                    booking_users = [booking_user.user for booking_user in booking.booking_user]
                    users.extend([user for user in booking_users 
                                if (attending := BookingExecutor.check_attending(
                                    booking_id=booking.booking_id, 
                                    user_id=user.user_id)) is None or attending])
                for user in users:
                    EmailSender.send_mail_reminder(booking, user)
                    if user.fcm_token:
                        PushNotification.send_notification_reminder(
                            fcm_token = user.fcm_token,
                            message_title = f"Reminder:{user.user_name} have {booking.title} Upcoming Meetings",
                            message_body = "The meeting will take place in 10 minutes.")