import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Modal,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getAllLanguages, deleteUserProfile } from '../api/userApi';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Language } from '../@types/language';
import { useProfile } from '../hooks/useProfile';
import { frontendPaths } from '../routes/paths';
import { formatLanguage } from '../utils/languageUtils';
import { PeerprepBackendError } from '../@types/PeerprepBackendError';
import { EMPTY_USERNAME_ERROR, USERNAME_NOT_ALPHANUMERIC_ERROR } from '../utils/errorMessages';
import { isAlphaNumeric } from '../utils/stringUtils';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export default function EditProfile() {
  const authContext = useAuth();
  const {
    username: currentUsername,
    name: currentName,
    preferredLanguageId: currentPreferredLanguageId,
    updateProfile,
  } = useProfile();
  const [newName, setNewName] = useState(currentName);
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [newPreferredLanguageId, setNewPreferredLanguageId] = useState(currentPreferredLanguageId);
  const navigate = useNavigate();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [usernameValidationErrorText, setUsernameValidationErrorText] = useState('');

  useEffect(() => {
    const fetchAndSetLanguages = async () => {
      await getAllLanguages().then(({ data }) => {
        setLanguages(data);
      });
    };
    fetchAndSetLanguages();
  }, []);

  useEffect(() => {
    if (newUsername.length === 0) {
      setUsernameValidationErrorText(EMPTY_USERNAME_ERROR);
      return;
    }
    if (!isAlphaNumeric(newUsername)) {
      setUsernameValidationErrorText(USERNAME_NOT_ALPHANUMERIC_ERROR);
      return;
    }
    setUsernameValidationErrorText('');
  }, [newUsername]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsername(event.target.value);
  };
  const handlePreferredLanguageChange = (event: SelectChangeEvent) => {
    setNewPreferredLanguageId(parseInt(event.target.value, 10));
  };
  const handleUpdateProfile = async () => {
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
        name: newName,
        username: newUsername,
        preferredLanguageId: newPreferredLanguageId,
      });
      navigate(`${frontendPaths.user}/${newUsername}`);
    } catch (error) {
      if (error instanceof PeerprepBackendError) {
        setUsernameValidationErrorText(error.details.message);
        return;
      }
      throw error;
    }
  };
  const handleDeleteAccount = async () => {
    await deleteUserProfile();
    logUserOut();
  };
  const logUserOut = () => {
    authContext.signout();
    navigate(frontendPaths.login, { replace: true });
  };
  const handleOpenModal = () => setisModalOpen(true);
  const handleCloseModal = () => setisModalOpen(false);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" padding="2rem" minWidth="400px">
      <Paper elevation={3} sx={{ padding: '2rem', width: { xs: '100%', md: '60%' } }}>
        <Box display="flex" flexDirection="column">
          <Stack spacing={2} direction="column">
            <Box>
              <Typography fontSize={16} fontWeight={5} pb={1}>
                Name
              </Typography>
              <TextField
                fullWidth
                placeholder={newName}
                value={newName}
                defaultValue={newName}
                onChange={handleNameChange}
              />
            </Box>
            <Box>
              <Typography fontSize={16} fontWeight={5} pb={1}>
                Username
              </Typography>
              <TextField
                fullWidth
                placeholder={newUsername}
                value={newUsername}
                defaultValue={newUsername}
                onChange={handleUsernameChange}
                error={!!usernameValidationErrorText}
                helperText={usernameValidationErrorText}
              />
            </Box>
            <Box pb={3}>
              <Typography fontSize={16} fontWeight={5} pb={1}>
                Preferred Language
              </Typography>
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
            </Box>
          </Stack>
          <Button variant="contained" onClick={handleUpdateProfile} sx={{ mb: 2 }}>
            Done
          </Button>
          <Button variant="outlined" color="error" onClick={handleOpenModal}>
            Delete account
          </Button>
          <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                We hate to see you go :(
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                Are you sure you want to delete your account?
              </Typography>
              <Box display="flex" flexDirection="row">
                <Box paddingRight={2}>
                  <Button variant="outlined" color="error" onClick={handleDeleteAccount}>
                    YES
                  </Button>
                </Box>
                <Box paddingLeft={2}>
                  <Button variant="outlined" onClick={handleCloseModal}>
                    NO
                  </Button>
                </Box>
              </Box>
            </Box>
          </Modal>
        </Box>
      </Paper>
    </Box>
  );
}
