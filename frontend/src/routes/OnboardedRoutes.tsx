import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';

export default function OnboardedRouteGuard() {
  const { isOnboarded } = useProfile();
  const location = useLocation();

  if (!isOnboarded) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  } else {
    return <Outlet />;
  }
}
