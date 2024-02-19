import { Modal } from 'antd';
import { BookingData } from '../../constant/constant';

const ConfirmAction = (
  key: string,
  isModalAction: boolean,
  message: string,
  handleAction: (key: string, data: BookingData) => Promise<void>,
  data: BookingData
) => {
  if (key !== null) {
    Modal.confirm({
      title: key,
      content: message,
      okText: key,
      open: isModalAction,
      onOk: async () => {
        await handleAction(key, data);
      },
    });
  }
};

export default ConfirmAction;
