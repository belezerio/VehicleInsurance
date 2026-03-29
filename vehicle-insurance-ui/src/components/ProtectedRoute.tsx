import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { token, userRole } = useAuth();

  if (!token) return <Navigate to="/login" />;
  if (!allowedRoles.includes(userRole!)) return <Navigate to="/" />;

  return <Outlet />;
};

export default ProtectedRoute;