import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popover,
  List,
  Spin,
  Typography,
} from 'antd';
import { get, post, put } from '../../ultils/request';
import { SearchOutlined } from '@ant-design/icons';
import { EditOutlined } from '@ant-design/icons';
import { handleErrorShow, handleSuccessShow } from '../../ultils/ultilsApi';
import './Room.css';
import FormAddRoom from './FormAddRoom';
import FormEditRoom from './FormEditRoom';
import RoomDetails from './RoomDetails';
import Title from 'antd/es/typography/Title';
interface Room {
  room_id: number;
  room_name: string;
  description: string;
  is_blocked: boolean;
}

const { Search } = Input;

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;
  const [totalRooms, setTotalRooms] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [roomId, setRoomId] = useState<Room>();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    handleDataRoomId();
    getInitalValues();
  }, [roomId?.room_id]);
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await get('/v1/rooms', {
        page: currentPage,
        per_page: perPage,
      });
      if (response) {
        setRooms(response.rooms);
        setTotalRooms(response.total_items);
        setCurrentPage(response.current_page);
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomId = async (roomId: number) => {
    try {
      setLoading(true);
      const response = await get(`/v1/rooms/${roomId}`);
      if (response) {
        setRoomId(response);
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };
  const handleRoomId = (id: number) => {
    setRoomId(undefined);
    fetchRoomId(id);
    setVisibleModal(true);
  };

  const handleDataRoomId = () => {
    return roomId || null;
  };

  const handleActionRoom = async (description: string | undefined) => {
    try {
      setLoading(true);
      if (roomId?.room_id && description) {
        const urlConfirmApi = roomId?.is_blocked
          ? `/v1/rooms/${roomId?.room_id}/opened`
          : `/v1/rooms/${roomId?.room_id}/blocked`;
        const response = await put(urlConfirmApi, { description: description });
        if (response) {
          fetchData();
          handleSuccessShow(response);
          handleCancelRoomId();
        }
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    const newPerPage = pageSize;
    const newCurrentPage =
      Math.ceil(((currentPage - 1) * perPage) / newPerPage) + 1;
    setCurrentPage(newCurrentPage);
  };
  const pagination = {
    current: currentPage,
    pageSize: perPage,
    total: totalRooms,
    onChange: handlePageChange,
    onShowSizeChange: handlePageSizeChange,
  };

  const handleShowAdd = () => {
    setIsModalVisible(true);
  };

  const handleAddRoom = async (values: any) => {
    try {
      const { room_name, description } = values;
      const response = await post('/v1/rooms', {
        room_name: room_name,
        description: description,
      });
      if (response) {
        fetchData();
        handleSuccessShow(response);
      }
    } catch (error: any) {
      handleErrorShow(error);
    }
    handleCancel();
  };

  const handleEdit = (id: number, name: string, description: string) => {
    setSelectedRoom({
      room_id: id,
      room_name: name,
      description: description,
      is_blocked: false,
    });
    formEdit.setFieldsValue({ room_name: name, description: description });
    setShowEditModal(true);
  };

  const handleUpdate = async (values: any) => {
    try {
      setLoading(true);
      if (selectedRoom) {
        const response = await put(`/v1/rooms/${selectedRoom?.room_id}`, {
          ...values,
        });
        if (response) {
          fetchData();
          setShowEditModal(false);
          handleSuccessShow(response);
        }
      }
    } catch (error: any) {
      handleErrorShow(error);
    }
    setLoading(false);
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };
  const handleSearch = async (value: string) => {
    if (value.length === 0) {
      fetchData();
    } else {
      try {
        setLoading(true);
        const response = await get('v1/rooms/search', {
          name: value,
        });
        if (response) {
          setRooms(response.rooms);
          setTotalRooms(response.total_items);
          setCurrentPage(response.current_page);
        }
      } catch (error: any) {
        handleErrorShow(error);
      } finally {
        setLoading(false);
      }
    }
  };
  const handleCancelRoomId = () => {
    setVisibleModal(false);
  };
  const getInitalValues = () => {
    return selectedRoom || null;
  };
  return (
    <div className='container'>
      <Space className='search'>
        <Search
          placeholder='Search...'
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
        />
        <Button type='primary' onClick={handleShowAdd}>
          Add Rooms
        </Button>
      </Space>
      <div className='action'>
        <Spin
          size='large'
          tip='Loading...'
          spinning={loading}
          className='loading'
        />
        <div className='card-group'>
          <List
            className='list'
            dataSource={rooms}
            grid={{
              gutter: [20, 20],
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 3,
              xxl: 3,
            }}
            pagination={pagination}
            renderItem={room => (
              <List.Item className='listItem'>
                <div key={room.room_id} className='room-card'>
                  <div className='room-info'>
                    <div
                      className='room-info-title'
                      onClick={() => handleRoomId(room.room_id)}
                    >
                      <Title level={3} style={{ color: '#1677FF' }}>
                        {room.room_name}
                      </Title>
                    </div>
                    <p
                      style={{
                        color: room.is_blocked ? 'red' : 'black',
                        fontSize: '1.3rem',
                      }}
                    >
                      Status: {room?.is_blocked ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div className='room-actions'>
                    <Space className='btn'>
                      <Popover content='Edit Room'>
                        <EditOutlined
                          className='btnClick'
                          onClick={() =>
                            handleEdit(
                              room.room_id,
                              room.room_name,
                              room.description || ''
                            )
                          }
                        />
                      </Popover>
                    </Space>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>

      <Modal
        title={
          <div className='btn'>
            <Typography.Title level={2} className='btn-click'>
              Edit Room Meeting
            </Typography.Title>
          </div>
        }
        visible={showEditModal}
        onCancel={handleCloseEditModal}
        footer={null}
      >
        <FormEditRoom
          form={formAdd}
          loading={loading}
          getInitialValues={getInitalValues}
          onFinish={handleUpdate}
          onCancel={handleCloseEditModal}
        />
      </Modal>

      <Modal
        title='Add Room'
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <FormAddRoom
          onFinish={handleAddRoom}
          loading={loading}
          onCancel={handleCancel}
          form={formAdd}
        />
      </Modal>

      {visibleModal && (
        <RoomDetails
          getRoom={handleDataRoomId}
          onCancel={handleCancelRoomId}
          onAction={handleActionRoom}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Rooms;
