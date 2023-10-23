import {
  Box,
  Button,
  Divider,
  FormControl,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getAllLanguages } from '../api/userApi';
import { Language } from '../@types/language';
import { useProfile } from '../hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { frontendPaths } from '../routes/paths';

export default function Onboarding() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const { name, updateProfile } = useProfile();
  const [newUsername, setNewUsername] = useState('');
  const [newPreferredLanguageId, setNewPreferredLanguageId] = useState(1);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [validationError, setValidationError] = useState(false);

  useEffect(() => {
    const fetchAndSetLanguages = async () => {
      try {
        const { data } = await getAllLanguages();
        setLanguages(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAndSetLanguages();
  }, []);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsername(event.target.value);
  };

  const handlePreferredLanguageChange = (event: SelectChangeEvent) => {
    const newPreferredLanguage = parseInt(event.target.value, 10);
    setNewPreferredLanguageId(newPreferredLanguage);
  };

  const handleSubmit = async () => {
    if (newUsername.length === 0) {
      console.error('username cannot be empty');
      setValidationError(true);
      return;
    }
    try {
      await updateProfile({
        username: newUsername,
        preferredLanguageId: newPreferredLanguageId,
      });
      enqueueSnackbar('Successfully completed onboarding!', { variant: 'success' });
      navigate(frontendPaths.dashboard);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error updating profile :(', { variant: 'error' });
      return;
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" padding="2rem" minWidth="400px">
      <Paper
        elevation={3}
        sx={{ padding: '2rem', minWidth: '400px', width: { xs: '100%', md: '60%' } }}
      >
        <Stack spacing={2}>
          <Typography variant="h5" textAlign="center">
            {`Hey ${name}! Let's get you set up.`}
          </Typography>
          <Divider />
          <Typography>Enter a username</Typography>
          <TextField
            fullWidth
            label="e.g. redsalmon42"
            value={newUsername}
            onChange={handleUsernameChange}
            error={validationError}
            helperText={validationError && 'Username cannot be empty'}
          />
          <Typography>Select your preferred language</Typography>
          <FormControl fullWidth>
            <Select
              labelId="preferred-language-label"
              id="preferred-language-select"
              value={newPreferredLanguageId.toString()}
              onChange={handlePreferredLanguageChange}
            >
              {languages.map((language: Language) => (
                <MenuItem key={language.id} value={language.id}>
                  {language.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" fullWidth type="submit" onClick={handleSubmit}>
            Done
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
