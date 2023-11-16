import { Box, Button, InputLabel, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { createUser } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import { PeerprepBackendError } from '../@types/PeerprepBackendError';
import { enqueueSnackbar } from 'notistack';

export default function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isFormDisabled, setIsFormDisabled] = useState(true);

  useEffect(() => {
    setIsFormDisabled(!(name.trim().length > 0));
  }, [name]);

  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  const handleFormSubmission = async () => {
    try {
      await createUser(name).then((resp) => {
        navigate(resp.data.id);
      });
    } catch (error) {
      if (error instanceof PeerprepBackendError) {
        enqueueSnackbar(error.details.message, { variant: 'error' });
      } else {
        console.error('Error:', error);
      }
    }
  };

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
        <InputLabel id="title-label">Account name</InputLabel>
        <TextField
          required
          margin="dense"
          id="name"
          type="text"
          variant="outlined"
          value={name}
          onChange={handleNameChange}
        ></TextField>
        <Button
          type="submit"
          onClick={handleFormSubmission}
          variant="contained"
          disabled={isFormDisabled}
        >
          Create account
        </Button>
      </Box>
    </>
  );
}
