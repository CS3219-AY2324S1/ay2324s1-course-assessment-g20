import { Navigate, createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import PublicOnlyRoutes from './PublicOnlyRoutes';
import ProtectedRoutes from './ProtectedRoutes';
import AuthRedirect from '../pages/AuthRedirect';
import AppWrapper from './AppWrapper';
import CodeEditor from '../pages/CodeEditor';
import Profile from '../pages/Profile';
import Dashboard from '../pages/Dashboard';
import Onboarding from '../pages/Onboarding';
import OnboardedRoutes from './OnboardedRoutes';
import NonOnboardedRoutes from './NonOnboardedRoutes';
import EditProfile from '../pages/EditProfile';

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
            element: <OnboardedRoutes />,
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
                path: '/user/:username',
                element: <Profile />,
              },
              {
                path: '/profile/edit',
                element: <EditProfile />,
              },
            ],
          },
          {
            element: <NonOnboardedRoutes />,
            children: [
              {
                path: '/onboarding',
                element: <Onboarding />,
              },
            ],
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
