from flask import Flask
from project.config import BaseConfig
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from celery import Celery
from pyfcm import FCMNotification
import firebase_admin
from firebase_admin import credentials
from flask_apscheduler import APScheduler

app=Flask(__name__)
CORS(app, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = BaseConfig.SQLALCHEMY_DATABASE_URI
app.config['JWT_SECRET_KEY'] = BaseConfig.JWT_SECRET_KEY
app.config['CELERY_BROKER_URL'] =  BaseConfig.CELERY_BROKER_URL
app.config['CELERY_RESULT_BACKEND'] = BaseConfig.CELERY_RESULT_BACKEND
app.config['MAIL_SERVER'] = BaseConfig.MAIL_SERVER
app.config['MAIL_PORT'] = BaseConfig.MAIL_PORT
app.config['MAIL_USERNAME'] = BaseConfig.MAIL_USERNAME
app.config['MAIL_PASSWORD'] = BaseConfig.MAIL_PASSWORD
app.config['MAIL_USE_TLS'] = BaseConfig.MAIL_USE_TLS
app.config['MAIL_USE_SSL'] = BaseConfig.MAIL_USE_SSL
app.config['MAIL_DEFAULT_SENDER'] = BaseConfig.MAIL_DEFAULT_SENDER
app.config['SCHEDULER_API_ENABLED'] = BaseConfig.SCHEDULER_API_ENABLED

celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

mail = Mail(app)

cred = credentials.Certificate(BaseConfig.FIREBASE_ADMIN_SDK)
firebase_admin.initialize_app(cred)
push_service = FCMNotification(api_key=BaseConfig.FCM_SERVER_KEY)

scheduler =  APScheduler()
scheduler.init_app(app)
scheduler.start()

db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

with app.app_context():
    from project import models
    db.create_all()

from project.api.common.base_response import BaseResponse
from werkzeug.exceptions import HTTPException 
app.register_error_handler(HTTPException, BaseResponse.error)

from project.api.v1.login_controller import login_blueprint
from project.api.v1.user_controller import user_blueprint
from project.api.v1.room_controller import room_blueprint
from project.api.v1.booking_controller import booking_blueprint

app.register_blueprint(login_blueprint, url_prefix='/v1')
app.register_blueprint(user_blueprint, url_prefix='/v1')
app.register_blueprint(room_blueprint, url_prefix='/v1')
app.register_blueprint(booking_blueprint, url_prefix='/v1')