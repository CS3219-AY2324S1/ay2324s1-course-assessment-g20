import { Navigate, createBrowserRouter } from 'react-router-dom';
import AppWrapper from './AppWrapper';
import Dashboard from '../pages/Dashboard';
import { frontendPaths } from './paths';

const router = createBrowserRouter([
  {
    element: <AppWrapper />,
    children: [
      {
        path: frontendPaths.dashboard,
        element: <Dashboard />,
      },
      { path: '*', element: <Navigate to={frontendPaths.dashboard} replace /> },
    ],
  },
]);

export default router;
