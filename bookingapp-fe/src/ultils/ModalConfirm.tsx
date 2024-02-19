import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Modal, Spin } from 'antd';

const confirm = (
  message: string,
  status: string | null,
  handleOk: (action: string) => void,
  loading: boolean
) => {
  if (status) {
    Modal.confirm({
      title: status === 'accept' ? 'Accept' : 'Reject',
      icon:
        status === 'accept' ? (
          <CheckCircleOutlined style={{ color: '#52c41a' }} />
        ) : (
          <ExclamationCircleOutlined />
        ),
      content: (
        <Spin spinning={loading}>
          <div>{message}</div>
        </Spin>
      ),
      okText: 'OK',
      onOk: () => handleOk(status),
    });
  }
};

export default confirm;
