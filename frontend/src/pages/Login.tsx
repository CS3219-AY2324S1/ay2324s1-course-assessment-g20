import { Box, Button, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const auth = useAuth();

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src="/assets/logo.png" alt="logo" width="200px" height="200px" />
        <Typography variant="h2" gutterBottom>
          PeerPrep
        </Typography>
        <Button onClick={auth.redirectToSignIn} variant="contained">
          <GoogleIcon sx={{ mr: 2 }} />
          Log in with Google
        </Button>
      </Box>
    </>
  );
}
