import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { frontendPaths } from './paths';
import { CircularProgress } from '@mui/material';

export default function NonOnboardedRouteGuard() {
  const { isLoading, isOnboarded } = useProfile();
  const location = useLocation();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isOnboarded) {
    if (location.state?.from?.pathname) {
      return <Navigate to={location.state.from.pathname} replace />;
    }
    return <Navigate to={frontendPaths.dashboard} replace />;
  } else {
    return <Outlet />;
  }
}
