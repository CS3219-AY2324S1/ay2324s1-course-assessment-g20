import { Navigate, createBrowserRouter, Outlet, useLocation } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import NavBar from '../navigation/NavBar';
import AuthPage from '../pages/AuthPage';
import { useAuth } from '../utils/hooks';

export default createBrowserRouter([
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

function RequireAuth() {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.authState) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else {
    return <Outlet />;
  }
}

function PublicOnly() {
  const auth = useAuth();
  const location = useLocation();
  if (auth.authState) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  } else {
    return <Outlet />;
  }
}
