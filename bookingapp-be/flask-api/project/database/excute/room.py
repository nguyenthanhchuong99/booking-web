from project.models import Room, Booking
from math import ceil
from project import db
from datetime import datetime
from itertools import islice
from sqlalchemy import or_
from typing import Optional, List, Tuple


class RoomExecutor:
    @staticmethod
    def get_paginated_rooms(page, per_page):
        query = Room.query.paginate(
            page=page, per_page=per_page, error_out=False)
        return query.items, query.total, ceil(query.total / per_page)

    @staticmethod
    def get_room_detail(room_id: int) -> Optional[dict]:
        room = Room.query.get_or_404(room_id)
        if room:
            return room.serialize()
        return None

    @staticmethod
    def get_room_by_name(room_name: str, room_id=None) -> Optional[Room]:
        existing_room_name = Room.query.filter_by(room_name=room_name)
        if room_id is not None:
            existing_room_name = existing_room_name.filter(Room.room_id != room_id)
        existing_room_name = existing_room_name.first()
        return existing_room_name

    @staticmethod
    def add_room(new_room: object):
            db.session.add(new_room)
            db.session.commit()
           
    @staticmethod
    def commit():
        db.session.commit()

    @staticmethod
    def get_room_by_id(room_id: int) -> Optional[Room]:
        return Room.query.get(room_id)

    @staticmethod
    def get_bookings_by_room_id(room_id: int) -> List[Booking]:
        return Booking.query.filter_by(room_id=room_id).all()
    
    @staticmethod
    def soft_delete_room_and_bookings(room: Room, bookings: List[Booking], description: Optional[str]) -> None:
        for booking in bookings:
            booking.deleted_at = datetime.now()
            booking.is_deleted = True

        room.deleted_at = datetime.now()
        room.is_blocked = True
        room.description = description
        db.session.commit()
        
    @staticmethod   
    def get_rooms_with_status(page: int, per_page: int):
        all_rooms = Room.query.all()

        start = (page - 1) * per_page
        end = start + per_page
        paginated_rooms = list(islice(all_rooms, start, end))

        current_time = datetime.now()

        for room in paginated_rooms:
            current_bookings = Booking.query.filter(
                Booking.room_id == room.room_id,
                Booking.time_start <= current_time,
                Booking.time_end >= current_time
            ).all()
            
            print(f"Room {room.room_id}:")
            print(f"Current time: {current_time}")
            print(f"Bookings: {current_bookings}")

            room.is_blocked = bool(current_bookings)

            if room.is_blocked:
                room.description = "BUSY"
            else:
                room.description = "FREE"

        db.session.commit()

        total_items = len(all_rooms)
        total_pages = ceil(total_items / per_page)

        return paginated_rooms, total_items, total_pages
    
    @staticmethod
    def open_room(room: Room, bookings: List[Booking], description: str) -> None:
        for booking in bookings:
            booking.deleted_at = None
            booking.is_deleted = False

        room.is_blocked = False
        room.description = description
        room.deleted_at = None
        db.session.commit()
        
    @staticmethod
    def filter_room_by_name(page: int, per_page: int, search_name: Optional[str]) -> Tuple[List[Room], int, int]:
        query = Room.query.filter(
            or_(Room.room_name.ilike(f"%{search_name}%")) if search_name else True,
            Room.is_blocked.is_(False)
        )
        
        paginated_rooms = query.paginate(page=page, per_page=per_page, error_out=False).items

        total_items = len(query.all())
        total_pages = ceil(len(query.all()) / per_page)

        return paginated_rooms, total_items, total_pages
