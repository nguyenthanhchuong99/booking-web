import { Button, Popover } from 'antd';
import { ActionBookingType } from '../../constant/constant';
import confirm from '../../ultils/ModalConfirm';

const ActionBooking: React.FC<ActionBookingType> = ({
  is_accepted,
  action,
  loading,
  visible,
}) => {
  const handleAction = (typeAction: string) => {
    const message =
      typeAction === 'accept'
        ? 'Do you want to accept booking'
        : 'Would you like to decline this meeting?';
    confirm(message, typeAction, action, loading);
  };
  return is_accepted ? (
    <>
      <Popover content='Edit' className='btn-right'>
        <Button onClick={() => visible('edit', true)}>Edit</Button>
      </Popover>
      <Popover content='Delete'>
        <Button danger onClick={() => visible('delete', true)}>
          Delete
        </Button>
      </Popover>
    </>
  ) : (
    <>
      <Popover content='Rejected' className='btn-right'>
        <Button danger onClick={() => handleAction('reject')}>
          Rejected
        </Button>
      </Popover>
      <Popover content='Accepted'>
        <Button type='primary' onClick={() => handleAction('accept')}>
          Accepted
        </Button>
      </Popover>
    </>
  );
};

export default ActionBooking;
