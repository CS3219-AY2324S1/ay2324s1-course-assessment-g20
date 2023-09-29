import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/hooks';

export default function NavBar() {
  const authContext = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    authContext.signout();
    navigate('/login', { replace: true });
  };

  const loginButton = () => {
    return (
      <Button color="inherit" onClick={authContext.redirectToSignIn}>
        Login
      </Button>
    );
  };

  const logoutButton = () => {
    return (
      <Button color="inherit" onClick={handleLogout}>
        Logout
      </Button>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>{authContext.isAuthenticated ? logoutButton() : loginButton()}</Toolbar>
      </AppBar>
    </Box>
  );
}
