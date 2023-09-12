import { Outlet } from 'react-router-dom';
import NavBar from '../navigation/NavBar';

// wraps all app pages
export default function AppWrapper() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
