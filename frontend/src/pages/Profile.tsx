import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Modal,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  getAllLanguages,
  deleteUserProfile,
} from '../api/userApi';
import { useAuth } from '../utils/hooks';
import { useNavigate } from 'react-router-dom';
import { Language } from '../@types/language';
import { useProfile } from '../hooks/useProfile';

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
  const { name, preferredLanguageId, updateProfile } = useProfile();
  const navigate = useNavigate();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isModalOpen, setisModalOpen] = useState(false);

  useEffect(() => {
    const fetchAndSetLanguages = async () => {
      await getAllLanguages().then(({ data }) => {
        setLanguages(data);
      });
    }
    fetchAndSetLanguages();
  }, []);

  const handlePreferredLanguageChange = (event: SelectChangeEvent) => {
    const newPreferredLanguage = event.target.value;
    updateProfile({ preferredLanguageId: newPreferredLanguage as unknown as number });
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
          <Typography fontSize={30} fontWeight={10} paddingBottom={3} align="center">
            {name}
          </Typography>
          <Box paddingBottom={3}>
            <Typography fontSize={16} fontWeight={5} paddingBottom={1} sx={{ opacity: 0.6 }}>
              Preferred Language
            </Typography>
            <FormControl fullWidth>
              <Select
                labelId="preferred-language-label"
                id="preferred-language-select"
                value={preferredLanguageId.toString()}
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
