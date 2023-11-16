import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CircularProgress } from '@mui/material';
import { frontendPaths } from '../routes/paths';
import { useProfile } from '../hooks/useProfile';

export default function AuthRedirect() {
  const auth = useAuth();
  const { isLoading, isOnboarded } = useProfile();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const userId = params.get('userId');

    if (!userId) {
      return;
    }

    auth.signIn({
      userId,
    });
  });

  if (auth.isAuthenticated && !isLoading) {
    if (isOnboarded) {
      return <Navigate to={frontendPaths.dashboard} />;
    }
    return <Navigate to={frontendPaths.onboarding} />;
  }

  return (
    <>
      <CircularProgress />
    </>
  );
}
