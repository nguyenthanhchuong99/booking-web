import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Modal } from 'antd';

const showPopup = (status: boolean, message: string) => {
  const handleModalClose = () => {
    Modal.destroyAll();
  };

  let icon = null;
  let title = '';

  if (status) {
    icon =<CheckCircleOutlined style={{ color: '#52c41a', fontSize: '50px' }} />      ;
    title = 'Success';
  } else {
    icon = <ExclamationCircleOutlined />;
    title = 'Error';
  }

  Modal.info({
    title,
    icon,
    content: message,
    okText: 'OK',
    onOk: handleModalClose,
  });
};

export { showPopup };
