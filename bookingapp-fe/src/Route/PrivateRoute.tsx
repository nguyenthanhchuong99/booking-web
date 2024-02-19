import { Outlet } from 'react-router-dom';
import UnauthorizedPage from './Unauthorized';
import getCookie from './Cookie';

const PrivateRoute = () => {
  const roles = getCookie('roles');
  const targetRole = 'admin';
  const exists: boolean = roles.includes(targetRole);
  return exists ? <Outlet /> : <UnauthorizedPage />;
};

export default PrivateRoute;
