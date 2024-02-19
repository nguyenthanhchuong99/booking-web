import React, { useState } from 'react';
import { Modal, Form, Input, Button, Typography, FormInstance } from 'antd';

const { Title } = Typography;

interface FormConfigItem {
  name: string;
  label: string;
}

interface CustomModalProps {
  title: string;
  visible: boolean;
  onCancel: () => void;
  formId: string;
  formConfig: FormConfigItem[];
  onFinish: (values: any) => void;
  loading: boolean;
  initialValues: string | undefined;
  form: FormInstance;
}

const CustomModal: React.FC<CustomModalProps> = ({
  title,
  visible,
  onCancel,
  formId,
  formConfig,
  loading,
  initialValues,
  onFinish,
  form,
}) => {
  const [success, setSuccess] = useState(false);

  const handleFinish = (values: string) => {
    onFinish(values);
    setSuccess(true);
  };

  const handleCloseModal = () => {
    setSuccess(false);
    onCancel();
  };

  return (
    <Modal
      title={<Title level={2}>{title}</Title>}
      visible={visible && !success}
      onCancel={handleCloseModal}
      footer={[
        <Button key='cancel' onClick={handleCloseModal}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' form={formId} htmlType='submit'>
          Submit
        </Button>,
      ]}
    >
      <Form form={form} id={formId} onFinish={handleFinish} disabled={loading}>
        {formConfig.map(item => (
          <Form.Item
            key={item.name}
            name={item.name}
            label={item.label}
            rules={[{ required: true, message: `Please enter ${item.label}` }]}
            initialValue={initialValues}
          >
            <Input type='text' />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default CustomModal;
