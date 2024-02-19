from flask import Blueprint, request
from werkzeug.exceptions import BadRequest, Unauthorized
from project import app
from project.services.login_service import AuthService
from flask_jwt_extended import jwt_required, get_jwt_identity
from project.api.common.base_response import BaseResponse

login_blueprint = Blueprint('login', __name__)


@login_blueprint.route('/form', methods=['OPTIONS'])
def handle_preflight():
    response = app.make_default_options_response()
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response


@login_blueprint.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        fcm_token= data.get('fcm_token')
        user = AuthService.authenticate_user(email, password,fcm_token)
        response = AuthService.login_user(user)
        return BaseResponse.success(response, "success", 200)
    except BadRequest as e:
        return BaseResponse.error(e)
    except Unauthorized as e:
        return BaseResponse.error(e)


@login_blueprint.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    user_id=get_jwt_identity()
    AuthService.logout_user(user_id)
    return BaseResponse.success(message="Logout successfully!")
