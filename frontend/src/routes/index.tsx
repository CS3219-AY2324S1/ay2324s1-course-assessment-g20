import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import PublicOnlyRoutes from './PublicOnlyRoutes';
import ProtectedRoutes from './ProtectedRoutes';
import AuthRedirect from '../pages/AuthRedirect';
import AppWrapper from './AppWrapper';

// This is a wrapper that allows us to retrieve data from hooks that need to be passed into the router (e.g for use by data loaders). It violates
// OCP because we have to modify this file every time we add a new hook that needs to be passed into the router.
// However, it's a small price to pay for the convenience of being able to use hooks in the router.
export default function PeerPrepRouterProvider() {
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

  return <RouterProvider router={router} />;
}
