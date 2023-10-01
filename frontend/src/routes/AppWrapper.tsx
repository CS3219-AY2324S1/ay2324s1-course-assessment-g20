import { Outlet } from 'react-router-dom';
import MainMenuBar from '../navigation/MainMenuBar';
import { useAuth } from '../utils/hooks';

// wraps all app pages
export default function AppWrapper() {
  const authContext = useAuth();

  return (
    <>
      {authContext.isAuthenticated && <MainMenuBar />}
      <Outlet />
    </>
  );
}
