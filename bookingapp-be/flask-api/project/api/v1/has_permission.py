from functools import wraps
from flask_jwt_extended import get_jwt_identity
from werkzeug.exceptions import Unauthorized, Forbidden
from project.database.excute.user import UserExecutor


def has_permission(required_permission):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            user_logged_id = get_jwt_identity()
            if not user_logged_id:
                raise Unauthorized()
    
            role_names = UserExecutor.get_role_names(user_logged_id)
            list_perssion_name=[]
            for role_name in role_names:
                permissions = UserExecutor.get_permission_names(role_name)
                for permission in permissions:
                    if permission not in list_perssion_name:
                        list_perssion_name.append(permission)
     
            if required_permission in list_perssion_name:
                return func(*args, **kwargs)
            else:
                raise Forbidden()
        return wrapper
    return decorator
