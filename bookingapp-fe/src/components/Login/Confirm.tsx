import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Modal } from 'antd';

const confirm = (
  message: string,
  status: boolean | null,
  handleOk: () => void
) => {
  if (status !== null) {
    Modal.confirm({
      title: status ? 'Success' : 'Error',
      icon: status ? (
        <CheckCircleOutlined style={{ color: '#52c41a' }} />
      ) : (
        <ExclamationCircleOutlined />
      ),
      content: message,
      okText: 'OK',
      onOk: handleOk,
    });
  }
};

export default confirm;
