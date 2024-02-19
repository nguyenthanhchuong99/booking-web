import React, { useEffect, useState } from 'react';
import { BookingData, DataType, HEADER } from '../../constant/constant';
import { Card, Spin, Table } from 'antd';
import './Booking.css';
import { url } from '../../ultils/urlApi';
import { handleErrorShow } from '../../ultils/ultilsApi';
import { ColumnsType } from 'antd/es/table';
import InfoInvitation from './InfoInvitation';
import { get } from '../../ultils/request';

interface DetailInvitationProps {
  selectInvite: BookingData | undefined;
}
const DetailInvitation: React.FC<DetailInvitationProps> = ({
  selectInvite,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [listUsers, setListUsers] = useState<DataType[]>([]);
  const getUser = async () => {
    if (selectInvite) {
      try {
        setLoading(true);
        const userPromises = selectInvite.user_ids.map(
          async (userId: number) => {
            const response = await get(`/v1/users/${userId}`);
            return response;
          }
        );
        const userDataArray = await Promise.all(userPromises);
        setListUsers(userDataArray);
      } catch (error: any) {
        handleErrorShow(error);
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    getUser();
  }, [selectInvite]);

  const columns: ColumnsType<DataType> = [
    {
      align: 'center',
      title: 'User ID',
      key: 'user_id',
      dataIndex: 'user_id',
    },
    {
      align: 'center',
      title: 'User Name',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      align: 'center',
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      align: 'center',
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
  ];

  return (
    <div>
      <Spin
        spinning={loading}
        size='large'
        tip='Loading...'
        className='loading'
      >
        <Card
          className='item-booking-wait'
          key={selectInvite!.title}
          title={
            <div className='title-booking-wait'>{selectInvite!.title}</div>
          }
        >
          <div className='info-booking-wait'>
            <InfoInvitation data={selectInvite} />
          </div>
        </Card>
        <Table className='list-user' columns={columns} dataSource={listUsers} />
      </Spin>
    </div>
  );
};

export default DetailInvitation;
