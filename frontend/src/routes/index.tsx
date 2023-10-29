import { Navigate, createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import PublicOnlyRoutes from './PublicOnlyRoutes';
import ProtectedRoutes from './ProtectedRoutes';
import AuthRedirect from '../pages/AuthRedirect';
import AppWrapper from './AppWrapper';
import CodeEditor from '../pages/CodeEditor';
import Profile from '../pages/Profile';
import Dashboard from '../pages/Dashboard';

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
          {
            path: '/session/:sessionId?',
            element: <CodeEditor />,
          },
          {
            path: '/profile',
            element: <Profile />,
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
