import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';

export default function NonOnboardedRouteGuard() {
  const { isOnboarded } = useProfile();
  const location = useLocation();

  if (isOnboarded) {
    if (location.state?.from?.pathname) {
      return <Navigate to={location.state.from.pathname} replace />;
    }
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Outlet />;
  }
}
