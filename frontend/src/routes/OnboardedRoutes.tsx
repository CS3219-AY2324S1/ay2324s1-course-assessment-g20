import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { frontendPaths } from './paths';
import { CircularProgress } from '@mui/material';

export default function OnboardedRouteGuard() {
  const { isLoading, isOnboarded } = useProfile();
  const location = useLocation();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!isOnboarded) {
    return <Navigate to={frontendPaths.onboarding} state={{ from: location }} replace />;
  } else {
    return <Outlet />;
  }
}
