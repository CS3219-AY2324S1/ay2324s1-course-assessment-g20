import { Outlet } from 'react-router-dom';

// wraps all app pages
export default function AppWrapper() {
  return (
    <>
      <Outlet />
    </>
  );
}
