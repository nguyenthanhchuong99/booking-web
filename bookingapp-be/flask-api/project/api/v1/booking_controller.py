from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from project.api.v1.has_permission import has_permission
from werkzeug.exceptions import BadRequest, NotFound, Conflict, UnprocessableEntity
from project.api.common.base_response import BaseResponse
from project.services.booking_service import BookingService
from typing import Dict

booking_blueprint = Blueprint('booking_controller', __name__)


@booking_blueprint.route("/bookings", methods=["GET"])
@jwt_required()
@has_permission("view")
def get_bookings() -> dict:
    try:
        response_data: dict = BookingService.get_bookings_in_date_range()
        return BaseResponse.success(response_data)

    except BadRequest as e:
        return BaseResponse.error(e)


@booking_blueprint.route("/bookings", methods=["POST"])
@jwt_required()
@has_permission("create")
def book_room_endpoint() -> dict:
    try:
        data = request.get_json()
        response_data: dict = BookingService.book_room(data)

        return response_data

    except Conflict as e:
        return BaseResponse.error(e)
    
    except Exception as e:
        return BaseResponse.error_validate(e)


@booking_blueprint.route("/bookings/<int:booking_id>", methods=["PUT"])
@jwt_required()
@has_permission("update")
def update_booking_endpoint(booking_id: int):
    try:
        data = request.get_json()
        response_data = BookingService.update_booking(booking_id, data)
        return response_data

    except Conflict as e:
        return BaseResponse.error(e)

    except NotFound as e:
        return BaseResponse.error(e)

    except Exception as e:
        return BaseResponse.error_validate(e)


@booking_blueprint.route("/bookings/<int:booking_id>", methods=["DELETE"])
@jwt_required()
@has_permission("delete")
def delete_booking(booking_id: int) -> Dict:
    try:
        response_data = BookingService.delete_booking_service(booking_id)
        return response_data
    
    except NotFound as e:
        return BaseResponse.error(e)

    except BadRequest as e:
        return BaseResponse.error(e)


@booking_blueprint.route("/bookings/<int:booking_id>/accept", methods=["PUT"])
@jwt_required()
@has_permission("update")
def accept_booking_endpoint(booking_id: int):
    try:
        response_data = BookingService.accept_booking(booking_id)
        return response_data

    except BadRequest as e:
        return BaseResponse.error(e)

    except NotFound as e:
        return BaseResponse.error(e)


@booking_blueprint.route("/user/bookings/<int:booking_id>/confirm", methods=["PUT"])
@jwt_required()
@has_permission("update")
def user_confirm_booking_endpoint(booking_id: int):
    try:
        response_data = BookingService.user_confirm_booking(booking_id)
        return response_data

    except UnprocessableEntity as e:
        return BaseResponse.error(e)


@booking_blueprint.route("/user/bookings/<int:booking_id>/decline", methods=["PUT"])
@jwt_required()
@has_permission("update")
def user_decline_booking_endpoint(booking_id: int):
    try:
        response_data = BookingService.user_decline_booking(booking_id)
        return response_data

    except UnprocessableEntity as e:
        return BaseResponse.error(e)


@booking_blueprint.route("/bookings/<int:booking_id>/reject", methods=["PUT"])
@jwt_required()
@has_permission("update")
def reject_booking_endpoint(booking_id: int):
    try:
        response_data = BookingService.reject_booking(booking_id)
        return response_data

    except NotFound as e:
        return BaseResponse.error(e)

    except UnprocessableEntity as e:
        return BaseResponse.error(e)


@booking_blueprint.route("/user/bookings", methods=["GET"])
@jwt_required()
@has_permission("view")
def get_user_bookings() -> dict:
    try:
        response_data: dict = BookingService.get_bookings_in_date_range_user()
        return BaseResponse.success(response_data)

    except BadRequest as e:
        return BaseResponse.error(e)


@booking_blueprint.route("/user/bookings", methods=["POST"])
@jwt_required()
@has_permission("create")
def book_room_endpoint_user() -> dict:
    try:
        data = request.get_json()
        response_data: dict = BookingService.book_room_belong_to_user(data)

        return response_data

    except NotFound as e:
        return BaseResponse.error(e)

    except Conflict as e:
        return BaseResponse.error(e)

    except Exception as e:
        return BaseResponse.error_validate(e)


@booking_blueprint.route("/admin/view_booking_pending", methods=["GET"])
@jwt_required()
@has_permission("view")
def admin_view_booking_pending() -> dict:
    try:
        result = BookingService.admin_view_booking_pending()
        return BaseResponse.success(result)

    except NotFound as e:
        raise BaseResponse.error(e)


@booking_blueprint.route("/user/view_booked", methods=["GET"])
@jwt_required()
@has_permission("view")
def user_view_list_booked() -> dict:
    try:
        result = BookingService.user_view_list_booked()
        return BaseResponse.success(result)

    except Exception as e:
        raise NotFound(str(e))


@booking_blueprint.route("/bookings/<int:booking_id>", methods=["GET"])
@jwt_required()
@has_permission("view")
def detail_booking(booking_id: int) -> dict:
    try:
        result = BookingService.detail_booking(booking_id)
        return BaseResponse.success(result)

    except NotFound as e:
        return BaseResponse.error(e)


@booking_blueprint.route("/bookings/search_room/<int:room_id>", methods=["GET"])
@jwt_required()
@has_permission("search")
def Search_booking_room(room_id: int):
    try:
        response_data: dict = BookingService.search_booking_room(room_id)
        return BaseResponse.success(response_data)

    except BadRequest as e:
        return BaseResponse.error(e)

    except NotFound as e:
        raise BaseResponse.error(e)


@booking_blueprint.route("/user/view_list_invite", methods=["GET"])
@jwt_required()
@has_permission("view")
def view_list_invite() -> dict:
    try:
        response_data: dict = BookingService.view_list_invite()
        return BaseResponse.success(response_data)
    except BadRequest as e:
        return BaseResponse.error(e)

    except NotFound as e:
        return BaseResponse.error(e)
