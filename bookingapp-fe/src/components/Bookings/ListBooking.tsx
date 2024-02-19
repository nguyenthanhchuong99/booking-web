import { List, Typography } from 'antd';
import React from 'react';
import { formatDate, formatTime } from '../../ultils/ultils';

interface BookingData {
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

interface ListBookingData {
  selectedBookingData: BookingData;
}

const ListBooking: React.FC<ListBookingData> = ({ selectedBookingData }) => {
  return (
    <>
      <div className='container-show-list-title'>
        <Typography.Title level={4}>
          Room: {selectedBookingData.room_name}
        </Typography.Title>
      </div>
      <div className='container-show-list-content'>
        <Typography.Title level={4}>
          <div className='container-show-list-content'>
            Người tạo phòng: {selectedBookingData?.creator_name}
          </div>
        </Typography.Title>
      </div>
      <div className='container-show-list-content'>
        <Typography.Title level={4}>
          <div className='container-show-list-content'>Người tham dự:</div>
          <div className='flex-container'>
            <List
              footer={null}
              dataSource={selectedBookingData.user_names}
              renderItem={user => (
                <List.Item className='container-show-listitem'>
                  <span>• {user}</span>
                </List.Item>
              )}
              style={{ padding: '1px' }}
            />
          </div>
        </Typography.Title>
      </div>
      <div className='container-show-time'>
        <div className='container-show-time-container'>
          <Typography.Text strong>Ngày bắt đầu họp:</Typography.Text>{' '}
          <Typography.Text>
            {selectedBookingData.start
              ? formatDate(selectedBookingData.start)
              : ''}
          </Typography.Text>
        </div>
        <div className='container-show-time-container'>
          <Typography.Text strong>Ngày kết thúc họp:</Typography.Text>{' '}
          <Typography.Text>
            {selectedBookingData.end ? formatDate(selectedBookingData.end) : ''}
          </Typography.Text>
        </div>
        <div className='container-show-time-container'>
          <Typography.Text strong>Giờ bắt đầu:</Typography.Text>{' '}
          <Typography.Text>
            {selectedBookingData.start
              ? formatTime(selectedBookingData.start)
              : ''}
          </Typography.Text>
        </div>
        <div className='container-show-time-container'>
          <Typography.Text strong>Giờ kết thúc:</Typography.Text>{' '}
          <Typography.Text>
            {selectedBookingData.end ? formatTime(selectedBookingData.end) : ''}
          </Typography.Text>
        </div>
      </div>
    </>
  );
};
export default ListBooking;
