import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  return (
    <Result
      status='403'
      title='403'
      subTitle='Bạn không có quyền truy cập vào trang này.'
      extra={
        <Button type='primary'>
          <Link to='/login'>Trở về đăng nhập</Link>
        </Button>
      }
    />
  );
};

export default UnauthorizedPage;
