from project.database.excute.user import UserExecutor
from datetime import timedelta
from werkzeug.exceptions import BadRequest, Unauthorized
from project.config import BaseConfig
from flask_jwt_extended import create_access_token
from project import db

class AuthService:
    @staticmethod
    def authenticate_user(email: str, password: str, fcm_token: str):
        if not email or not password:
            raise BadRequest("Email and password are required.")
        user = UserExecutor.get_user_by_email(email)
        if not user or not user.check_password(password):
            raise Unauthorized("Invalid email or password.")
        
        user.fcm_token=fcm_token
        db.session.commit()
        return user

    @staticmethod
    def login_user(user: object):
        access_token = create_access_token(
            identity=user.user_id, expires_delta=timedelta(days=int(BaseConfig.TOKEN_EXPIRATION_DAYS)))
        role_name = UserExecutor.get_role_names(user.user_id)
        user_name = user.user_name
        access_token = access_token
        data = [
            {"token": access_token},
            {"role_name": role_name},
            {"user_name": user_name},
            {"user_id": user.user_id}
        ]
        return data

    @staticmethod
    def logout_user(user_id: int):
        user = UserExecutor.get_user(user_id)
        user.fcm_token=None
        db.session.commit()