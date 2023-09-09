import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../utils/hooks';

export default function PublicOnly() {
  const auth = useAuth();
  const location = useLocation();
  if (auth.authState) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  } else {
    return <Outlet />;
  }
}
