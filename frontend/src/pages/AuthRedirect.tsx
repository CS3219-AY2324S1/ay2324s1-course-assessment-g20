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

    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (!accessToken || !refreshToken) {
      return;
    }

    auth.signIn({
      accessToken: accessToken!,
      refreshToken: refreshToken!,
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
