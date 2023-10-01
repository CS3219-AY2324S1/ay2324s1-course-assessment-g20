import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  getUserProfile,
  updateUserProfile,
  getAllLanguages,
  deleteUserProfile,
} from '../api/userApi';
import { UserProfile } from '../@types/UserProfile';
import { Language } from '../@types/Language';
import { useAuth } from '../utils/hooks';
import { useNavigate } from 'react-router-dom';

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

export default function Profile() {
  const authContext = useAuth();
  const navigate = useNavigate();
  const [preferredLanguage, setPreferredLanguage] = useState<string>('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [isModalOpen, setisModalOpen] = useState(false);

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
  const handleDeleteAccount = async () => {
    await deleteUserProfile();
    logUserOut();
  };
  const logUserOut = () => {
    authContext.signout();
    navigate('/login', { replace: true });
  };
  const handleOpenModal = () => setisModalOpen(true);
  const handleCloseModal = () => setisModalOpen(false);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" padding="2rem">
      <Paper elevation={3} sx={{ padding: '2rem', width: '50%' }}>
        <Box display="flex" flexDirection="column">
          <Typography fontSize={20} variant="h1" fontWeight={20} paddingBottom={3} align="center">
            {userProfile.name}
          </Typography>
          <Box paddingBottom={3}>
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
          </Box>
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
