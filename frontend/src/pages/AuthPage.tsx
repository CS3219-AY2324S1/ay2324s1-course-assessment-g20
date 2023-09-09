import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/hooks';

export default function AuthPage() {
  const navigate = useNavigate();

  const auth = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    auth.signIn({
      accessToken: accessToken!,
      refreshToken: refreshToken!,
    });

    navigate('/dashboard', { replace: true });
  }, []);

  return <>Wait a moment, authenticating</>;
}
