import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function PublicOnlyRoutes() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    if (location.state?.from?.pathname) {
      return <Navigate to={location.state.from.pathname} replace />;
    }
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Outlet />;
  }
}
