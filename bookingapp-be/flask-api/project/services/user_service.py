from project import db
from werkzeug.exceptions import Conflict, Unauthorized, NotFound, BadRequest
from project.models.user import User
from project.api.common.base_response import BaseResponse
from project.database.excute.user import UserExecutor
from typing import Dict, List
from math import ceil
from datetime import datetime
from flask_jwt_extended import get_jwt_identity
import os
from flask import request
from project.api.common.constant import DEFAULT_PAGE, DEFAULT_PER_PAGE , MAX_ITEMS_PER_PAGE
class UserService:

    @staticmethod
    def paginated_users(users:  List[User]):
        paginated_users = []
        for user in users.items:
            roles = [user_role.role.role_name for user_role in user.user_has_role]
            user_info = {
                "user_id": user.user_id,
                "user_name": user.user_name,
                "email": user.email,
                "phone_number": user.phone_number,
                "created_at": user.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "updated_at": user.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
                "role_name": roles
            }
            paginated_users.append(user_info)
        return paginated_users

    @staticmethod
    def get_list_users() -> List[User]:
        page = int(request.args.get('page', DEFAULT_PAGE))
        per_page = int(request.args.get('per_page', DEFAULT_PER_PAGE))
        if per_page == -1:
            per_page = MAX_ITEMS_PER_PAGE

        users = UserExecutor.get_list_users(page, per_page)
        paginated_users = UserService.paginated_users(users)

        total_items = users.total
        total_pages = ceil(total_items / per_page)
        per_page = per_page
        current_page = page
        result = {
            'users': paginated_users,
            'total_items': total_items,
            'per_page': per_page,
            'current_page': current_page,
            'total_pages': total_pages
        }
        return result

    @staticmethod
    def add_new_user(data: Dict):
        user_name = data.get('user_name')
        email = data.get('email')
        phone_number = data.get('phone_number')
        password = data.get('password')
        role_ids = data.get('role_id')
        created_at = datetime.now()
        updated_at = datetime.now()
        is_deleted = False
        new_user = User(
            user_name=user_name,
            email=email,
            phone_number=phone_number,
            password=password,
            created_at=created_at,
            updated_at=updated_at,
            is_deleted=is_deleted
        )
        validate_error = new_user.validate_all_fields()
        if validate_error:
            return BaseResponse.error_validate(validate_error)

        existing_email = UserExecutor.check_existing_email(email)
        if existing_email:
            raise Conflict("Email already exists")

        existing_phone = UserExecutor.check_existing_phone(phone_number)
        if existing_phone:
            raise Conflict("Phone number already exists")

        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        for role_id in role_ids:
            UserExecutor.add_user_role(new_user.user_id, role_id)
        return BaseResponse.success(message="User created successfully")

    @staticmethod
    def update_user(data: Dict, user_id: int):
        user_name = data.get('user_name')
        phone_number = data.get('phone_number')
        role_ids = data.get('role_id')
        user = UserExecutor.get_user(user_id)

        if not user:
            raise NotFound("User not found with provided user_id.")

        errors = []
        validate_phone_number = User.validate_phone_number(phone_number)
        if validate_phone_number:
            errors.append(validate_phone_number)

        validate_user_name = User.validate_user_name(user_name)
        if validate_user_name:
            errors.append(validate_user_name)

        if errors:
            return BaseResponse.error_validate(errors)

        existing_phone = UserExecutor.check_existing_phone(phone_number, user_id)
        if existing_phone:
            raise Conflict("Phone number already exists")

        user.user_name = user_name
        user.phone_number = phone_number
        user.updated_at = datetime.now()
        UserExecutor.delete_user_role(user_id)
        for role_id in role_ids:
            UserExecutor.add_user_role(user_id, role_id)
        db.session.commit()
        return BaseResponse.success(message="Updated user successfully")

    @staticmethod
    def delete_user(user_id: int):
        user = UserExecutor.get_user(user_id)
        if not user:
            raise NotFound("User not found with provided user_id.")
        user.is_deleted = True
        user.updated_at = datetime.now()
        db.session.commit()
        return BaseResponse.success(message="Deleted successfully!")

    @staticmethod
    def detail_user(user_id: int):
        user = UserExecutor.get_user(user_id)
        if user is None:
            raise NotFound("No data found")
        role_names = [user_role.role.role_name for user_role in user.user_has_role]
        detail_user = {
            "user_id": user.user_id,
            "user_name": user.user_name,
            "email": user.email,
            "phone_number": user.phone_number,
            "created_at": user.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "updated_at": user.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
            "role_name": role_names
        }
        return detail_user
    
    @staticmethod
    def change_password(data: Dict):
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')
        user_id = get_jwt_identity()

        user = UserExecutor.get_user(user_id)
        if not user:
            raise NotFound("User not found with provided user_id.")

        validate_password = User.validate_password(new_password)
        if validate_password:
            return BaseResponse.error_validate(validate_password)

        if not user.check_password(current_password):
            raise Unauthorized("Invalid current password!")
        elif confirm_password != new_password:
            raise BadRequest("Confirm password does not match new password!")

        user.password = new_password
        user.set_password(new_password)
        db.session.commit()
        return BaseResponse.success(message="Change password successfully!")
    
    @staticmethod
    def edit_profile(data: Dict):
        new_name = data.get('user_name')
        new_phone_number = data.get('phone_number')
        user_id = get_jwt_identity()
        
        user = UserExecutor.get_user(user_id)
        if not user:
            raise NotFound("User not found with provided user_id.")

        errors = []
        validate_phone_number = User.validate_phone_number(new_phone_number)
        if validate_phone_number:
            errors.append(validate_phone_number)

        validate_user_name = User.validate_user_name(new_name)
        if validate_user_name:
            errors.append(validate_user_name)
        if errors:
            return BaseResponse.error_validate(errors)

        existing_phone = UserExecutor.check_existing_phone(new_phone_number, user_id)
        if existing_phone:
            raise Conflict("Phone number already exists")

        user.user_name = new_name
        user.phone_number = new_phone_number
        db.session.commit()
        return BaseResponse.success(message="Update profile successfully!")
    
    @staticmethod
    def search_list_user() ->  List[User]:
        search = request.args.get('search')
        page = int(request.args.get('page', DEFAULT_PAGE))
        per_page = int(request.args.get('per_page', DEFAULT_PER_PAGE))
        if per_page == -1:
            per_page = MAX_ITEMS_PER_PAGE
        users = UserExecutor.search_list_user(page, per_page, search)
        if users is None:
            raise NotFound("No data found")
        paginated_users = UserService.paginated_users(users)

        total_items = users.total
        total_pages = ceil(total_items / per_page)
        per_page = per_page
        current_page = page
        result = {
            'users': paginated_users,
            'total_items': total_items,
            'per_page': per_page,
            'current_page': current_page,
            'total_pages': total_pages
        }
        return result
