import { Navigate, createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';

export default createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  { path: '*', element: <Navigate to="/login" replace /> },
]);
