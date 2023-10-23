import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CircularProgress } from '@mui/material';

export default function AuthRedirect() {
  const auth = useAuth();

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

  if (auth.isAuthenticated) {
    return <Navigate to="/onboarding" />;
  }

  return (
    <>
      <CircularProgress />
    </>
  );
}
