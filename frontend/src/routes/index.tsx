import {
  Navigate, 
  createBrowserRouter, 
  // defer
} from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import PublicOnlyRoutes from './PublicOnlyRoutes';
import ProtectedRoutes from './ProtectedRoutes';
import AuthRedirect from '../pages/AuthRedirect';
import AppWrapper from './AppWrapper';
import CodeEditor from '../pages/CodeEditor';
import Profile from '../pages/Profile';
// import { getUser } from '../api/user';

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
            path: '/question/:questionId',
            element: <CodeEditor />,
          },
        ],
      },
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: '/profile',
            element: <Profile />,
            // @TODO uncomment once auth interceptor is ready
            // loader: async () => {
            //   const userProfile = await pingProtectedBackend(authContext);
            //   return defer({ userProfile })
            // },
          },
        ],
      },
      {
        path: '/authRedirect',
        element: <AuthRedirect />,
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
