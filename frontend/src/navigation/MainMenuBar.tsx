import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useProfile } from '../hooks/useProfile';
import { frontendPaths } from '../routes/paths';

export default function MainMenuBar() {
  const authContext = useAuth();
  const navigate = useNavigate();
  const { palette } = useTheme();
  const { username, isOnboarded } = useProfile();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuToggle = () => setMobileOpen((prevState) => !prevState);

  // Can eventually abstract into a type / interface
  const options = [
    {
      title: 'Profile',
      onClick: () => {
        navigate(`${frontendPaths.user}/${username}`);
      },
      icon: <AccountCircleIcon />,
    },
    {
      title: 'Logout',
      onClick: () => {
        authContext.signout();
        navigate(frontendPaths.login, { replace: true });
      },
      icon: <LogoutIcon />,
    },
  ];

  const drawer = (
    <Box onClick={handleMenuToggle} sx={{ textAlign: 'center' }}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ backgroundColor: '#2F4858' }}
      >
        <img
          src="/assets/logo.png"
          alt="logo"
          width="35px"
          height="35px"
          style={{ marginRight: '10px' }}
        />
        <Typography variant="h6" color="white" sx={{ py: 2, backgroundColor: 'secondary' }}>
          PeerPrep
        </Typography>
      </Box>
      <List>
        {options.map((option) => (
          <ListItem key={option.title} disablePadding>
            <ListItemButton onClick={option.onClick}>
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText primary={option.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav" position="fixed" sx={{ backgroundColor: palette.primary.main }}>
        <Toolbar>
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
            }}
          >
            <Box
              onClick={() =>
                navigate(isOnboarded ? frontendPaths.dashboard : frontendPaths.onboarding)
              }
              sx={{
                display: 'flex',
                alignItems: 'center',
                ':hover': {
                  cursor: 'pointer',
                },
              }}
            >
              <img
                src="/assets/logo.png"
                alt="logo"
                width="35px"
                height="35px"
                style={{ marginRight: '10px' }}
              />
              <Typography
                variant="h6"
                component="div"
                fontFamily="sans-serif"
                sx={{
                  display: { xs: 'none', sm: 'contents' },
                }}
                onClick={() => navigate('/')}
              >
                PeerPrep
              </Typography>
            </Box>
          </Box>
          <IconButton
            aria-label="open drawer"
            edge="end"
            onClick={handleMenuToggle}
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon sx={{ color: 'white' }} />
          </IconButton>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {options.map((option) => (
              <Button
                key={option.title}
                sx={{ color: 'white', '&:hover': { backgroundColor: palette.primary.dark } }}
                onClick={option.onClick}
              >
                {option.title}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          anchor="top"
          variant="temporary"
          open={mobileOpen}
          onClose={handleMenuToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}
