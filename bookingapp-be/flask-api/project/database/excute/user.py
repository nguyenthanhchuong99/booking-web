from project.models.user import User
from project.models.user_has_role import UserHasRole
from project.models.role import Role
from project.models.role_has_permission import RoleHasPermission
from project.models.permission import Permission
from typing import List
from project import db


class UserExecutor:

    @staticmethod
    def get_user_by_email(email: str):
        user = User.query.filter_by(email=email, is_deleted=0).first()
        return user

    @staticmethod
    def get_user_email_by_id(user_id):
        user = User.query.filter_by(user_id=user_id, is_deleted=False).first()
        if user:
            return user.email
        else:
            return None
        
    @staticmethod
    def get_user(user_id: int):
        user = User.query.filter_by(user_id=user_id, is_deleted=0).first()
        return user

    @staticmethod
    def get_role_names(user_id: int) -> List[str]:
        user = User.query.filter_by(user_id=user_id, is_deleted=0).first()
        role_names = []
        if  user and user.user_has_role:
            role_names = [
                user_role.role.role_name for user_role in user.user_has_role]
        return role_names

    @staticmethod
    def get_permission_names(role_name: str) -> List[str]:
        role = Role.query.filter_by(role_name=role_name).first()
        permission_names=[]
        if role:
            role_permissions = (
                db.session.query(Permission.permission_name)
                .join(RoleHasPermission, Permission.permission_id == RoleHasPermission.permission_id)
                .filter(RoleHasPermission.role_id == role.role_id)
                .all()
            )
            permission_names = [rp[0] for rp in role_permissions]
        return permission_names
    
    @staticmethod
    def get_list_users(page: int, per_page: int)-> List[User]:
        users = User.query.filter_by(is_deleted=False).paginate(
            page=page, per_page=per_page, error_out=False)
        return users

    @staticmethod
    def add_user_role(user_id: int, role_id: int):
        new_user_role = UserHasRole(
                user_id=user_id, role_id=role_id)
        db.session.add(new_user_role)
        db.session.commit()

    @staticmethod
    def delete_user_role(user_id: int):
        UserHasRole.query.filter_by(user_id=user_id).delete()

    @staticmethod
    def add_user(new_user: object):
        db.session.add(new_user)
        db.session.commit()

    @staticmethod   
    def check_existing_phone(phone_number: str, user_id=None):
        existing_phone = User.query.filter_by(phone_number=phone_number)
        if user_id is not None:
            existing_phone = existing_phone.filter(User.user_id != user_id)
        existing_phone = existing_phone.first()
        return existing_phone
    
    @staticmethod
    def check_existing_email(email: str):
        existing_email = User.query.filter(User.email == email).first()
        return existing_email
    
    @staticmethod
    def get_list_user_by_role_name(role_name: str):
        users = (User.query
        .join(UserHasRole,User.user_id==UserHasRole.user_id)
        .join(Role,UserHasRole.role_id==Role.role_id)
        .filter(
            Role.role_name==role_name, 
            User.is_deleted==0).all()
        )
        return users
    
    @staticmethod
    def search_list_user(page: int, per_page: int, search: str) : 
        users = User.query.filter(User.is_deleted == False).filter(
            (User.email.like(f'%{search}%')) |
            (User.user_name.like(f'%{search}%'))
        ).paginate(page=page, per_page=per_page, error_out=False)
        return users
