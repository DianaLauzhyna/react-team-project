import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectUserToken } from 'redux/authorization/selectorsAuth';

const PrivateRoute = () => {
  const token = useSelector(selectUserToken);
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
