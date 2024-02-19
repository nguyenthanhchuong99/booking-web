import { Outlet } from 'react-router-dom';
import getCookie from './Cookie';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = getCookie('token');
  return token ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoute;
