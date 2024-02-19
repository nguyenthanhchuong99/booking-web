from flask import jsonify
from werkzeug.exceptions import HTTPException
class BaseResponse:
    @staticmethod
    def success(data=None, message="Success", code=200):
        response = {
            "status": code,
            "message": message,
            "data": data
        }
        return jsonify(response),code

    @staticmethod
    def error(e):
        description = e.description if e.description else str(e)
        response = {
            "status": e.code,
            "message": e.__class__.__name__,
            "errors": description
        }
        return jsonify(response), e.code
    
    @staticmethod
    def error_validate(data=None, message="Error validate", code=400):
        response = {
            "status": code,
            "message": message,
            "errors": data
        }
        return jsonify(response),code