import { Tag } from 'antd';
import getCookie from '../Route/Cookie';
import { useState } from 'react';

export const TYPE_USER = { ADMIN: 'admin' };
export interface DataType {
  user_id: number;
  role_id: number[];
  user_name: string;
  role_name: string[];
  phone_number: string;
  email: string;
  is_deleted: boolean;
  is_attending: boolean;
}

export interface BookingData {
  booking_id: number;
  room_name: string;
  title: string;
  user_name: string[];
  time_start: string;
  time_end: string;
  is_accepted: boolean;
  is_deleted: boolean;
  booking_users: [];
  creator_name: string;
  status: boolean | null;
  user_ids: number[];
}
export interface BookingDataCalendar {
  title: string;
  booking_id: number | null;
  is_accepted: boolean;
  start: string;
  end: string;
  user_ids: number[];
  room_id: number | null;
  room_name: string;
  user_names: string[];
  backgroundColor: string;
  creator_name: string;
  creator_id: string;
}

export interface BookingDataApi {
  title: string;
  booking_id: number | null;
  is_accepted: boolean;
  time_start: string;
  time_end: string;
  user_ids: number[];
  room_id: number | null;
  room_name: string;
  user_names: string[];
  creator_name: string;
  creator_id: number;
}
export interface Room {
  room_id: number;
  room_name: string;
  description: string | null;
  is_blocked: boolean;
}

export const token = getCookie('token');
export const roles = getCookie('roles');

export const statuTag = (item: BookingData) => {
  if (item.is_deleted) {
    return (
      <Tag className='status-tag' color='#ff0000'>
        Rejected
      </Tag>
    );
  } else if (item.is_accepted) {
    return (
      <Tag className='status-tag' color='#009900'>
        Successed
      </Tag>
    );
  } else {
    return (
      <Tag className='status-tag' color='#ff9933'>
        Pending
      </Tag>
    );
  }
};

export interface ActionBookingType {
  is_accepted: boolean;
  action: (type: string) => void;
  visible: (action: string, visible: boolean) => void;
  loading: boolean;
}

export const firebaseConfig = {
  apiKey: 'AIzaSyDeyU826NnvMNoFlXI-tN_qsBMbFkHwGf4',
  authDomain: 'rikkei-intern-web-2023.firebaseapp.com',
  projectId: 'rikkei-intern-web-2023',
  storageBucket: 'rikkei-intern-web-2023.appspot.com',
  messagingSenderId: '189121251757',
  appId: '1:189121251757:web:f56e773f6eebe65601f924',
  measurementId: 'G-9YR2Y5Q7HK',
};

export const HEADER = {
  Authorization: `Bearer ${token}`,
  'ngrok-skip-browser-warning': true,
};

export const renderHeader = (token: any): any => ({
  Authorization: `Bearer ${token}`,
  'ngrok-skip-browser-warning': true,
});

export const ChangePageSize = () => {
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageSizeChange = (pageSize: number) => {
    const newPerPage = pageSize;
    const newCurrentPage =
      Math.ceil(((currentPage - 1) * perPage) / newPerPage) + 1;
    setCurrentPage(newCurrentPage);
  };
  return { handlePageSizeChange };
};

export const ERROR = {
  message: 'Data not found',
};
