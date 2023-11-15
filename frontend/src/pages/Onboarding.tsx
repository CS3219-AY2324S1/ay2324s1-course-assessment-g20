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
import { formatLanguage } from '../utils/languageUtils';
import { PeerprepBackendError } from '../@types/PeerprepBackendError';
import { EMPTY_USERNAME_ERROR, USERNAME_NOT_ALPHANUMERIC_ERROR } from '../utils/errorMessages';
import { isAlphaNumeric } from '../utils/stringUtils';

export default function Onboarding() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const { name, updateProfile } = useProfile();
  const [newUsername, setNewUsername] = useState('');
  const [newPreferredLanguageId, setNewPreferredLanguageId] = useState(1);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isUsernameEdited, setIsUsernameEdited] = useState(false);
  const [usernameValidationErrorText, setUsernameValidationErrorText] = useState('');

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

  useEffect(() => {
    if (isUsernameEdited) {
      if (newUsername.length === 0) {
        setUsernameValidationErrorText(EMPTY_USERNAME_ERROR);
        return;
      }
      if (!isAlphaNumeric(newUsername)) {
        setUsernameValidationErrorText(USERNAME_NOT_ALPHANUMERIC_ERROR);
        return;
      }
    }
    setUsernameValidationErrorText('');
  }, [newUsername, isUsernameEdited]);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUsernameEdited(true);
    setNewUsername(event.target.value);
  };

  const handlePreferredLanguageChange = (event: SelectChangeEvent) => {
    const newPreferredLanguage = parseInt(event.target.value, 10);
    setNewPreferredLanguageId(newPreferredLanguage);
  };

  const handleSubmit = async () => {
    if (newUsername.length === 0) {
      setUsernameValidationErrorText(EMPTY_USERNAME_ERROR);
      return;
    }
    if (!isAlphaNumeric(newUsername)) {
      setUsernameValidationErrorText(USERNAME_NOT_ALPHANUMERIC_ERROR);
      return;
    }
    try {
      await updateProfile({
        username: newUsername.trim(),
        preferredLanguageId: newPreferredLanguageId,
      });
      enqueueSnackbar('Successfully completed onboarding!', { variant: 'success' });
      navigate(frontendPaths.dashboard);
    } catch (error) {
      if (error instanceof PeerprepBackendError) {
        setUsernameValidationErrorText(error.details.message);
        return;
      }
      throw error;
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" padding="2rem" minWidth="400px">
      <Paper elevation={3} sx={{ padding: '2rem', width: { xs: '100%', md: '60%' } }}>
        <Stack spacing={2}>
          <Typography variant="h4" textAlign="center">
            {`Hey ${name}!`}
          </Typography>
          <Typography variant="subtitle1" textAlign="center">
            Let's get you set up.
          </Typography>
          <Divider />
          <Typography>Enter a username</Typography>
          <TextField
            fullWidth
            label="e.g. redsalmon42"
            value={newUsername}
            onChange={handleUsernameChange}
            error={!!usernameValidationErrorText}
            helperText={usernameValidationErrorText}
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
                  {formatLanguage(language.name)}
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
