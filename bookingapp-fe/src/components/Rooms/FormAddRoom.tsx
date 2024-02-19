import React from 'react';
import { Form, Button, FormInstance } from 'antd';
import './Room.css';
import CustomFormItem from './CustomFormItem';

interface FormAdd {
  onFinish: (values: any) => void;
  onCancel: () => void;
  loading: boolean;
  form: FormInstance;
}

const FormAddRoom: React.FC<FormAdd> = ({
  onFinish,
  onCancel,
  form,
  loading,
}) => {
  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  const handleSubmit = (values: any) => {
    onFinish(values);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      labelCol={{ span: 5 }}
      labelAlign='left'
      disabled={loading}
      preserve={false}
      wrapperCol={{ flex: 4 }}
    >
      <CustomFormItem
        label='Room Name: '
        name='room_name'
        rules={[{ required: true, message: 'Room Name cannot required' }]}
      />
      <CustomFormItem
        label='Description : '
        name='description'
        rules={[{ required: true, message: 'Description cannot required' }]}
      />
      <Form.Item className='action-btn'>
        <Button htmlType='button' onClick={handleCancel} className='btn-right'>
          Cancel
        </Button>
        <Button type='primary' htmlType='submit' loading={loading}>
          Add
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormAddRoom;
