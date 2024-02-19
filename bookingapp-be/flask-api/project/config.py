import os
from dotenv import load_dotenv

load_dotenv()

class BaseConfig:
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    TOKEN_EXPIRATION_DAYS = os.environ.get('TOKEN_EXPIRATION_DAYS')
    CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND')
    CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL')
    SCHEDULER_API_ENABLED= os.environ.get('SCHEDULER_API_ENABLED')
    FCM_SERVER_KEY = os.environ.get('FCM_SERVER_KEY')
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = int(os.environ.get('MAIL_PORT'))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS').lower() == 'true'
    MAIL_USE_SSL = os.environ.get('MAIL_USE_SSL').lower() == 'true'
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER')
    FIREBASE_ADMIN_SDK=os.environ.get('FIREBASE_ADMIN_SDK')

class DevelopmentConfig(BaseConfig):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    TOKEN_EXPIRATION_DAYS = os.environ.get('TOKEN_EXPIRATION_DAYS')

class TestingConfig(BaseConfig):
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')


class ProductionConfig(BaseConfig):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
