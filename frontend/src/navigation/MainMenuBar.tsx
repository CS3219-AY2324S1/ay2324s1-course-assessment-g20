import { AppBar, Box, Button, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';

const options = ['Profile', 'Logout'];

export default function MainMenuBar() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h3"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            PEERPREP
          </Typography>
          <Button
            variant={'contained'}
            onClick={handleOpenUserMenu}
            style={{ fontSize: '15px' }}
            sx={{
              width: 100,
              height: 50,
              backgroundColor: 'black',
            }}
          >
            OPTIONS
          </Button>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {options.map((options) => (
              <MenuItem key={options} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{options}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
