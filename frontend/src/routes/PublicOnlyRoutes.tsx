import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function PublicOnlyRoutes() {
  const auth = useAuth();
  const location = useLocation();
  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  } else {
    return <Outlet />;
  }
}
