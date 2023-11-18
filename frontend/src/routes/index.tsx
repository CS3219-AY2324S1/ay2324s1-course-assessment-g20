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
import { frontendPaths } from './paths';
import SoloCodeEditor from '../pages/SoloCodeEditor';

const router = createBrowserRouter([
  {
    element: <AppWrapper />,
    children: [
      {
        element: <PublicOnlyRoutes />,
        children: [
          {
            path: frontendPaths.login,
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
                path: frontendPaths.dashboard,
                element: <Dashboard />,
              },
              {
                path: `${frontendPaths.session}/:sessionId?`,
                element: <CodeEditor />,
              },
              {
                path: `${frontendPaths.user}/:username`,
                element: <Profile />,
              },
              {
                path: frontendPaths.editProfile,
                element: <EditProfile />,
              },
              {
                path: `${frontendPaths.codeEditor}/:sessionId`,
                element: <SoloCodeEditor />,
              },
            ],
          },
          {
            element: <NonOnboardedRoutes />,
            children: [
              {
                path: frontendPaths.onboarding,
                element: <Onboarding />,
              },
            ],
          },
        ],
      },
      { path: '*', element: <Navigate to={frontendPaths.login} replace /> },
    ],
  },
  {
    path: frontendPaths.authRedirect,
    element: <AuthRedirect />,
  },
]);

export default router;
