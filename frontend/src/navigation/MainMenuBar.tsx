import { AppBar, Box, Drawer, IconButton, Toolbar, Typography, useTheme } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MainMenuBar() {
  const navigate = useNavigate();
  const { palette } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuToggle = () => setMobileOpen((prevState) => !prevState);

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
