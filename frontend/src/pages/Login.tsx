import { Box, Typography } from '@mui/material';

export default function Login() {
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
      </Box>
    </>
  );
}
