import { Navigate, createBrowserRouter, Outlet } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import NavBar from '../navigation/NavBar';
import AuthPage from '../pages/AuthPage';
import PublicOnly from './PublicOnly';
import RequireAuth from './RequireAuth';

export const router = createBrowserRouter([
  {
    element: (
      <>
        <NavBar />
        <Outlet />
      </>
    ),
    children: [
      {
        element: <PublicOnly />,
        children: [
          {
            path: '/login',
            element: <Login />,
          },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: '/dashboard',
            element: <Dashboard />,
          },
        ],
      },
      {
        path: '/authRedirect',
        element: <AuthPage />,
      },
      { path: '*', element: <Navigate to="/login" replace /> },
    ],
  },
]);

export default router;
