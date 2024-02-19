import { Typography, Result, Button, Spin, Modal, Divider } from 'antd';
import CustomModal from './CustomModal';
import RoomModalContent from './ModalContent';
import { useEffect, useState } from 'react';
import form from 'antd/es/form';
import './Room.css';

const { Title, Text } = Typography;

interface Room {
  room_id: number;
  room_name: string;
  description: string;
  is_blocked: boolean;
}

interface RoomDetailsPropsType {
  getRoom: () => Room | null;
  onCancel: () => void;
  onAction: (description: string | undefined) => Promise<void>;
  loading: boolean;
}

const RoomDetails: React.FC<RoomDetailsPropsType> = ({
  getRoom,
  onCancel,
  onAction,
  loading,
}) => {
  const [isOpenModalVisible, setIsOpenModalVisible] = useState<boolean>(false);
  const [isLookModalVisible, setIsLookModalVisible] = useState<boolean>(false);
  const [formLook] = form.useForm();
  const [formOpen] = form.useForm();
  const room = getRoom();

  useEffect(() => {
    getRoom();
  }, []);
  const handleModal = (
    isOpen: boolean,
    roomDescription: string,
    modalType: 'look' | 'open'
  ) => {
    const setIsModalVisible =
      modalType === 'look' ? setIsLookModalVisible : setIsOpenModalVisible;
    setIsModalVisible(isOpen);
  };

  const handleClose = () => {
    onCancel();
  };

  const lookFormConfig = [
    {
      name: 'description',
      label: 'Description',
    },
  ];

  const openFormConfig = [
    {
      name: 'description',
      label: 'Description',
    },
  ];

  const getInitialValues = () => {
    return room?.description
      ? room.description
      : (undefined as string | undefined);
  };

  return (
    <>
      {loading ? (
        <Spin
          size='large'
          tip='Loading...'
          spinning={loading}
          className='loading'
        />
      ) : room?.is_blocked ? (
        <Modal
          title={<Title level={2}>Room is Blocked</Title>}
          visible={room?.is_blocked}
          onCancel={handleClose}
          cancelText='No'
          onOk={() => handleModal(true, room?.description, 'open')}
          okText='Open'
        >
          <Result
            status='error'
            subTitle={
              <div style={{ textAlign: 'center' }}>
                <Text>Description: {room?.description}</Text>
              </div>
            }
            extra={
              <>
                <div style={{ textAlign: 'center' }}>
                  <Text style={{ marginRight: '10px' }}>
                    Do you want to reopen this room?
                  </Text>
                </div>
              </>
            }
          />
        </Modal>
      ) : (
        <Modal
          title={
            <>
              <div className='modal-title'>
                <Title level={2}>{room?.room_name}</Title>
              </div>
              <Divider style={{ margin: '16px 0' }} />
            </>
          }
          visible={!room?.is_blocked}
          onOk={() => handleModal(true, room!.description, 'look')}
          okText='Lock'
          onCancel={handleClose}
          cancelText='Cancel'
        >
          <Spin
            size='large'
            tip='Loading...'
            spinning={loading}
            className='loading'
          />
          <RoomModalContent room={room} />
        </Modal>
      )}

      <CustomModal
        title='Lock Rooms'
        loading={loading}
        visible={isLookModalVisible}
        onCancel={() => handleModal(false, '', 'look')}
        formId='lookForm'
        formConfig={lookFormConfig}
        onFinish={(values: { description: string } | undefined) =>
          onAction(values?.description)
        }
        initialValues={getInitialValues()}
        form={formLook}
      />

      <CustomModal
        title='Open Rooms'
        visible={isOpenModalVisible}
        onCancel={() => handleModal(false, '', 'open')}
        loading={loading}
        formId='openForm'
        formConfig={openFormConfig}
        onFinish={(values: { description: string } | undefined) =>
          onAction(values?.description)
        }
        initialValues={getInitialValues()}
        form={formOpen}
      />
    </>
  );
};

export default RoomDetails;
