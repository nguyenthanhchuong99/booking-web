from flask import Blueprint, request
from werkzeug.exceptions import Conflict, NotFound, BadRequest, Unauthorized
from flask_jwt_extended import jwt_required
from project.api.v1.has_permission import has_permission
from project.services.user_service import UserService
from project.api.common.base_response import BaseResponse

user_blueprint = Blueprint('user', __name__)

@user_blueprint.route('/users', methods=['GET'])
@jwt_required()
@has_permission("view")
def view_list_user():
    try:
        response = UserService.get_list_users()
        return BaseResponse.success(response)
    except NotFound as e:
        return BaseResponse.error(e)

@user_blueprint.route('/users', methods=['POST'])
@jwt_required()
@has_permission("create")
def create_user():
    try:
        data = request.get_json()
        response = UserService.add_new_user(data)
        return response
    except Conflict as e:
        return BaseResponse.error(e)
    except Exception as e:
        return BaseResponse.error_validate(e)

@user_blueprint.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
@has_permission('update')
def update_user(user_id):
    try:
        data = request.get_json()
        response = UserService.update_user(data, user_id)
        return response
    except NotFound as e:
        return BaseResponse.error(e)
    except Conflict as e:
        return BaseResponse.error(e)
    except Exception as e:
        return BaseResponse.error_validate(e)

@user_blueprint.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
@has_permission("delete")
def delete_user(user_id):
    try:
        response = UserService.delete_user(user_id)
        return response
    except NotFound as e:
        return BaseResponse.error(e)

@user_blueprint.route('/users/search', methods=['GET'])
@jwt_required()
@has_permission("view")
def search_user_by_name_or_email():
    try:
        response = UserService.search_list_user()
        return BaseResponse.success(response)
    except NotFound as e:
        raise BaseResponse.error(e)
    
@user_blueprint.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
@has_permission("view")
def get_detail_user(user_id):
    try:
        user=UserService.detail_user(user_id)
        return BaseResponse.success(user)
    except NotFound as e:
        raise BaseResponse.error(e)
    
@user_blueprint.route('/users/change_password', methods=['PUT'])
@jwt_required()
@has_permission("update")
def change_password():
    try:
        data = request.get_json()
        response = UserService.change_password(data)
        return response
    except NotFound as e:
        return BaseResponse.error(e)
    except BadRequest as e:
        return BaseResponse.error(e)
    except Unauthorized as e:
        return BaseResponse.error(e)
    
@user_blueprint.route('/users/profile', methods=['PUT'])
@jwt_required()
@has_permission("update")
def edit_profile():
    try:
        data = request.get_json()
        response = UserService.edit_profile(data)
        return response
    except NotFound as e:
        return BaseResponse.error(e)
    except Conflict as e:
        return BaseResponse.error(e)
    except Exception as e:
        return BaseResponse.error_validate(e)
    
