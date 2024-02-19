import React, { useState } from 'react';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import axios from 'axios';
import { handleError, handleErrorShow } from '../../ultils/ultilsApi';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { url } from '../../ultils/urlApi';
import './Form.css';
import { getMessagingToken } from '../Notification/Firebase';

const { Title, Text } = Typography;

const FormLogin: React.FC = () => {
  const Navigate = useNavigate();
  const [form] = Form.useForm();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  let fcm_token: string;
  getMessagingToken()
    .then(result => {
      if (result) {
        fcm_token = result;
      }
    })
    .catch(error => {
      handleError(error);
    });
  const onFinish = async (values: any) => {
    const value = { ...values, fcm_token: fcm_token };
    try {
      setLoading(true);
      await axios
        .post(url + '/v1/login', value, {
          withCredentials: true,
        })
        .then(res => {
          if (res?.data?.data) {
            const token: string = res.data.data[0].token;
            const roles: string[] = res.data.data[1].role_name;
            const name: string = res.data.data[2].user_name;
            const id: number = res.data.data[3].user_id;
            Cookies.set('roles', JSON.stringify(roles));
            Cookies.set('token', token);
            Cookies.set('name', name);
            Cookies.set('id', id.toString());
            if (roles.includes('admin')) {
              Navigate('/');
            } else {
              Navigate('/calendarmeeting');
            }
          }
        })
        .catch(error => {
          handleErrorShow(error);
        });
    } catch (error) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    setErrors(
      errorInfo.errorFields.reduce((acc: Record<string, string>, curr: any) => {
        acc[curr.name[0]] = curr.errors[0];
        return acc;
      }, {})
    );
  };
  return (
    <div className='form-login-container'>
      <div className='form-login-title'>
        <Title level={2}>Booking Login</Title>
        <Text underline strong>
          {' '}
          Welcome to RikkeiSoft{' '}
        </Text>
      </div>
      <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Form.Item
          name='email'
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Invalid email format' },
          ]}
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email}
          className='form-login-item'
        >
          <Input
            prefix={<MailOutlined className='icon icon-mail form-login-icon' />}
            placeholder='Email'
            allowClear
            className='form-login-input'
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          name='password'
          rules={[{ required: true, message: 'Password is required' }]}
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password}
          className='form-login-item'
        >
          <Input.Password
            prefix={
              <LockOutlined className='icon icon-look-outlined form-login-icon' />
            }
            placeholder='Password'
            allowClear
            className='form-login-input'
            disabled={loading}
          />
        </Form.Item>

        <Form.Item className=''>
          <Button
            type='primary'
            htmlType='submit'
            block
            className='form-login-btn'
            loading={loading}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormLogin;
