import { useEffect, useState } from 'react';
import { BookingData, ChangePageSize, statuTag } from '../../constant/constant';
import { Card, List, Spin } from 'antd';
import './Booking.css';
import { handleErrorShow } from '../../ultils/ultilsApi';
import { get } from '../../ultils/request';
import InfoInvitation from './InfoInvitation';
import { useSelector } from 'react-redux';
const ListBookingOfUser = () => {
  const [listBooking, setListBooking] = useState<BookingData[]>([]);
  const [perPage, setPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const shouldRender = useSelector(
    (state: any) => state.shouldRender.shouldRender
  );

  useEffect(() => {
    getData();
  }, [shouldRender]);
  useEffect(() => {
    getData();
  }, [currentPage, perPage]);
  const getData = async () => {
    setLoading(true);
    try {
      setLoading(true);
      const response = await get(`/v1/user/view_booked`, {
        page: currentPage,
        per_page: perPage,
      });
      if (response) {
        setListBooking(response.list_bookings);
        setTotalItems(response.total_items);
        setPerPage(response.per_page);
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const pagination = {
    current: currentPage,
    pageSize: perPage,
    total: totalItems,
    onChange: handlePageChange,
    onShowSizeChange: ChangePageSize,
  };
  const customLabelStyle = {
    fontWeight: 'bold',
    marginRight: '8px',
    color: 'black',
  };
  const customContentStyle = {
    display: 'flex',
    justifyContent: 'end',
    marginRight: 100,
  };

  return (
    <div>
      <h1 className='component-name'>List of scheduled meetings</h1>
      <Spin
        spinning={loading}
        size='large'
        tip='Loading...'
        className='loading'
      >
        <List
          dataSource={listBooking}
          pagination={pagination}
          renderItem={(item: BookingData) => (
            <List.Item>
              <Card
                className='item-booked'
                key={item.title}
                title={<div className='title-booked'>{item.title}</div>}
              >
                <div className='info-booked'>
                  <InfoInvitation data={item} />
                  <div className='status-booked'>{statuTag(item)}</div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Spin>
    </div>
  );
};

export default ListBookingOfUser;
