import { Box, Button, Typography } from '@mui/material';
import { useAuth } from '../utils/hooks';

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
        <Typography variant="h1" gutterBottom>
          PeerPrep
        </Typography>
        <Button onClick={auth.redirectToSignIn} variant="contained">
          Log in
        </Button>
      </Box>
    </>
  );
}
