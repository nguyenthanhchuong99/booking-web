import { useEffect, useState } from 'react';
import { BookingData, ChangePageSize, HEADER } from '../../constant/constant';
import './Booking.css';
import DetailBookingWait from './DetailBookingWait';
import { Card, Col, List, Modal, Row, Spin } from 'antd';
import { handleErrorShow, handleSuccessShow } from '../../ultils/ultilsApi';
import InfoInvitation from './InfoInvitation';
import ConfirmAction from './ConfirmAction';
import BtnAccept from './BtnAccept';
import BtnReject from './BtnReject';
import BtnDetail from './BtnDetail';
import { get, put } from '../../ultils/request';
import { useSelector } from 'react-redux';

const WaitingBookingList = () => {
  const [listBooking, setListBooking] = useState<BookingData[]>([]);
  const [perPage, setPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectBooking, setSelectBooking] = useState<BookingData>();
  const [isModalDetail, setIsModalDetail] = useState<boolean>(false);
  const [isModalAction, setIsModalAction] = useState<boolean>(false);
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
      const response = await get(`/v1/admin/view_booking_pending`, {
        page: currentPage,
        per_page: perPage,
      });
      if (response?.list_bookings) {
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
  const handleAction = async (key: string, data: BookingData) => {
    if (data) {
      try {
        setLoading(true);
        const response = await put(
          `/v1/bookings/${data.booking_id}/${key}`,
          {}
        );
        if (response) {
          handleModalAction(false);
          handelViewDetail(false);
          handleSuccessShow(response);
          getData();
        }
      } catch (error: any) {
        handleErrorShow(error);
      } finally {
        setLoading(false);
      }
    }
  };
  const handelViewDetail = (status: boolean) => {
    setIsModalDetail(status);
  };
  const handleModalAction = (status: boolean) => {
    setIsModalAction(status);
  };

  const handleShowModalAction = (booking: BookingData, key: string) => {
    setSelectBooking(booking);
    if (key === 'view') {
      handelViewDetail(true);
    } else {
      handleModalAction(true);
      const message: string = `Are you sure to ${key} this booking?`;
      ConfirmAction(key, isModalAction, message, handleAction, booking);
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
  return (
    <div>
      <div className='header-component'>
        <h2 className='component-name'>List of waiting booking</h2>
      </div>
      <Spin
        spinning={loading}
        size='large'
        tip='Loading...'
        className='spin-loading'
      >
        <List
          dataSource={listBooking}
          pagination={pagination}
          renderItem={(item: BookingData) => (
            <List.Item>
              <Card
                className='item-booking-wait'
                key={item.title}
                title={<div className='title-booking-wait'>{item.title}</div>}
              >
                <div className='info-booking-wait'>
                  <InfoInvitation data={item} />
                  <div className='container-btn'>
                    <Row className='container-row'>
                      <Col xxl={8} xl={8} sm={13}>
                        <BtnDetail
                          selectBooking={item}
                          handleSelectAction={async () =>
                            handleShowModalAction(item, 'view')
                          }
                        />
                      </Col>
                      <Col xxl={8} xl={8} sm={13}>
                        <BtnAccept
                          name='ACCEPT'
                          data={item}
                          handleSelectAction={async () =>
                            handleShowModalAction(item, 'accept')
                          }
                          defaultType={true}
                          disabled={null}
                        />
                      </Col>
                      <Col xxl={8} xl={8} sm={13}>
                        <BtnReject
                          name='REJECT'
                          data={item}
                          handleSelectAction={async () =>
                            handleShowModalAction(item, 'reject')
                          }
                          defaultType={true}
                          disabled={null}
                        />
                      </Col>
                    </Row>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Spin>
      <Modal
        open={isModalDetail}
        onCancel={() => handelViewDetail(false)}
        width={'80%'}
        footer={[]}
      >
        <DetailBookingWait
          selectBooking={selectBooking}
          handleAction={async (booking, key) =>
            handleShowModalAction(booking, key)
          }
        />
      </Modal>
    </div>
  );
};

export default WaitingBookingList;
