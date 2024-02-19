import React, { useEffect } from 'react';
import { Form, Input, Button, FormInstance, Row, Col } from 'antd';
import CustomFormItem from './CustomFormItem';

interface Room {
  room_id: number;
  room_name: string;
  description: string | null;
  is_blocked: boolean;
}

interface FormEdit {
  getInitialValues: () => Room | null;
  onFinish: (values: any) => void;
  onCancel: () => void;
  loading: boolean;
  form: FormInstance;
}

const FormEditRoom: React.FC<FormEdit> = ({
  getInitialValues,
  onFinish,
  loading,
  onCancel,
  form,
}) => {
  const initialValues: Room | null = getInitialValues();
  useEffect(() => {
    form.resetFields();
    getInitialValues();
  }, [initialValues]);
  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  const handelFinish = (values: any) => {
    if (values) {
      form.resetFields();
      onFinish(values);
    }
  };

  return (
    <Form
      form={form}
      initialValues={{
        room_name: initialValues?.room_name,
        description: initialValues?.description,
      }}
      onFinish={handelFinish}
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
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};
export default FormEditRoom;
