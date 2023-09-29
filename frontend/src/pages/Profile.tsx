import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile, getAllLanguages } from '../api/userApi';
import { UserProfile } from '../@types/UserProfile';
import { Language } from '../@types/Language';

export default function Profile() {
  const [preferredLanguage, setPreferredLanguage] = useState<string>('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({});

  useEffect(() => {
    getAllLanguages().then(({ data }) => {
      console.log(data);
      setLanguages(data);
    });

    getUserProfile().then(({ data }) => {
      console.log(data);
      setUserProfile(data);
      setPreferredLanguage(data.preferredLanguage.id);
    });
  }, []);

  const handlePreferredLanguageChange = (event: SelectChangeEvent) => {
    const newPreferredLanguage = event.target.value;
    setPreferredLanguage(newPreferredLanguage);
    updateUserProfile({ preferredLanguageId: newPreferredLanguage as unknown as number });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <Paper elevation={3} sx={{ padding: '2rem', width: '50%' }}>
        <Typography fontSize={20} variant="h1" fontWeight={20} paddingBottom={3} align="center">
          {userProfile.name}
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="preferred-language-label">Preferred Language</InputLabel>
          <Select
            labelId="preferred-language-label"
            id="preferred-language-select"
            value={preferredLanguage}
            label="Preferred Language"
            onChange={handlePreferredLanguageChange}
          >
            {languages.map((language: Language) => (
              <MenuItem key={language.id} value={language.id}>
                {language.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>
    </Box>
  );
}
