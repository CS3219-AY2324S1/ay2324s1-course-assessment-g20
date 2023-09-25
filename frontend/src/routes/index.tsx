import { Navigate, createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import PublicOnlyRoutes from './PublicOnlyRoutes';
import ProtectedRoutes from './ProtectedRoutes';
import AuthRedirect from '../pages/AuthRedirect';
import AppWrapper from './AppWrapper';

const router = createBrowserRouter([
  {
    element: <AppWrapper />,
    children: [
      {
        element: <PublicOnlyRoutes />,
        children: [
          {
            path: '/login',
            element: <Login />,
          },
        ],
      },
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: '/dashboard',
            element: <Dashboard />,
          },
        ],
      },
      { path: '*', element: <Navigate to="/login" replace /> },
    ],
  },
  {
    path: '/authRedirect',
    element: <AuthRedirect />,
  },
]);

export default router;
