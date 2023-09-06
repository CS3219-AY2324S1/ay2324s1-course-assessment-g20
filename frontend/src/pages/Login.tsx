import { Box, Button, TextField, Typography } from '@mui/material';

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
        <TextField id="outlined-basic" label="Username" variant="outlined" />
        <TextField id="outlined-basic" label="Password" variant="outlined" />
        <Button href={`/dashboard`} variant="contained">
          Log in
        </Button>
      </Box>
    </>
  );
}
