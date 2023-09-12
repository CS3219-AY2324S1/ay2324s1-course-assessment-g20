import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/hooks';

export default function AuthRedirect() {
  const auth = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    auth.signIn({
      accessToken: accessToken!,
      refreshToken: refreshToken!,
    });
  }, []);

  if (auth.authState?.accessToken && auth.authState?.refreshToken) {
    return <Navigate to="/dashboard" />;
  }

  return <></>;
}
