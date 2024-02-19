from project.database.excute.room import RoomExecutor
from project import db
from werkzeug.exceptions import Conflict, BadRequest, NotFound
from project.api.common.base_response import BaseResponse
from project.models import Room, Booking
from typing import Optional, List, Dict
from flask import request
from project.api.common.constant import DEFAULT_PAGE, DEFAULT_PER_PAGE , MAX_ITEMS_PER_PAGE

class RoomService:
    @staticmethod
    def get_paginated_rooms():

        page = int(request.args.get('page', DEFAULT_PAGE))
        per_page = int(request.args.get('per_page', DEFAULT_PER_PAGE))
        if per_page == -1:
            per_page = MAX_ITEMS_PER_PAGE    
        items, total_items, total_pages = RoomExecutor.get_paginated_rooms(
            page, per_page)

        return {
            "rooms": [item.serialize() for item in items],
            "total_items": total_items,
            "current_page": page,
            "per_page": per_page,
            "total_pages": total_pages
        }

    @staticmethod
    def get_room_detail(room_id: int) -> Optional[Room]:
        return RoomExecutor.get_room_detail(room_id)

    @staticmethod
    def create_room(data: Dict):
        room_name = data.get("room_name")
        description= data.get("description")
        new_room = Room(room_name= room_name, description= description, is_blocked= False)

        errors = new_room.validate_all_fields()
        if errors:
            return BaseResponse.error_validate(errors)
         
        existing_room: Optional[Room] = RoomExecutor.get_room_by_name(room_name)
        if existing_room:
            raise Conflict("Room already exists")

        RoomExecutor.add_room(new_room)
        return BaseResponse.success(message="Room created successfully!")

    @staticmethod
    def update_room(room_id: int, data: Dict) -> None:
        room_name = data.get("room_name")
        description= data.get("description")
        room_to_update = Room.query.get(room_id)

        if not room_to_update:
            raise NotFound("Room not found")
        
        room_to_update.room_name = room_name
        room_to_update.description= description

        errors = room_to_update.validate_all_fields()
        if errors:
            return BaseResponse.error_validate(errors)

        existing_room = RoomExecutor.get_room_by_name(room_name,room_id)
        if existing_room:
            raise Conflict("Room name already exists")
        
        db.session.commit()
        return BaseResponse.success(message="Update room successfully!")

    @staticmethod
    def delete_room(room_id: int, data: Optional[Dict]) -> Dict:
        try:
            room_to_delete: Room = RoomExecutor.get_room_by_id(room_id)

            if not room_to_delete:
                raise NotFound("Room not found")

            if room_to_delete.is_blocked:
                raise BadRequest("Cannot block locked rooms")

            description: Optional[str] = data.get(
                "description") if data else None

            bookings_to_delete: List[Booking] = RoomExecutor.get_bookings_by_room_id(
                room_id)

            RoomExecutor.soft_delete_room_and_bookings(
                room_to_delete, bookings_to_delete, description)

            return BaseResponse.success(message="Room and associated bookings blocked successfully")

        except Exception as e:
            raise NotFound(e)

    @staticmethod
    def get_status_rooms():
        page = int(request.args.get('page', DEFAULT_PAGE))
        per_page = int(request.args.get('per_page', DEFAULT_PER_PAGE))
        if per_page == -1:
            per_page = MAX_ITEMS_PER_PAGE 
        paginated_rooms, total_items, total_pages = RoomExecutor.get_rooms_with_status(page, per_page)

        return {
            "rooms": [room.serialize() for room in paginated_rooms],
            "total_items": total_items,
            "current_page": page,
            "per_page": per_page,
            "total_pages": total_pages
        }

    @staticmethod
    def search_rooms() -> Dict[str, int]:
        page = int(request.args.get('page', DEFAULT_PAGE))
        per_page = int(request.args.get('per_page', DEFAULT_PER_PAGE))
        search_name: str = request.args.get('name', '')
        if per_page == -1:
            per_page = MAX_ITEMS_PER_PAGE
        
        paginated_rooms, total_items, total_pages = RoomExecutor.filter_room_by_name(page, per_page, search_name)

        return {
            "rooms": [room.serialize() for room in paginated_rooms],
            "total_items": total_items,
            "current_page": page,
            "per_page": per_page,
            "total_pages": total_pages
        }

    @staticmethod
    def open_room(room_id: int, data: Dict) -> Dict:
        room_to_open = RoomExecutor.get_room_by_id(room_id)

        if not room_to_open:
            raise NotFound("Room not found")

        if not room_to_open.is_blocked:
            raise BadRequest("Room is already open")

        description = data.get("description")

        bookings_to_open = RoomExecutor.get_bookings_by_room_id(room_id)

        RoomExecutor.open_room(room_to_open, bookings_to_open, description)

        return BaseResponse.success(message="Room and associated bookings opened successfully")
