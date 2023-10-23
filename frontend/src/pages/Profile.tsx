import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import { useProfile } from '../hooks/useProfile';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserProfileByUsername } from '../api/userApi';
import { UserProfile } from '../@types/userProfile';
import { frontendPaths } from '../routes/paths';
import { formatLanguage } from '../utils/stringUtils';

export default function Profile() {
  const { username } = useParams();
  const { username: ownUsername, preferredLanguage, name } = useProfile();
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [profile, setProfile] = useState<UserProfile>();
  const navigate = useNavigate();

  useEffect(() => {
    setIsOwnProfile(username === ownUsername);
    if (!isOwnProfile) {
      const fetchAndSetProfile = async () => {
        try {
          const { data } = await getUserProfileByUsername(username ?? '');
          setProfile(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchAndSetProfile();
    }
  }, [isOwnProfile, username]);

  const handleEditProfile = () => {
    navigate(frontendPaths.editProfile);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" padding="2rem" minWidth="400px">
      <Paper
        elevation={3}
        sx={{ padding: '2rem', minWidth: '400px', width: { xs: '100%', md: '60%' } }}
      >
        <Box display="flex" flexDirection="column">
          <Box pb={2}>
            <Typography fontSize={30} fontWeight={10} align="center">
              {isOwnProfile ? name : profile?.name}
            </Typography>
            <Typography fontSize={16} align="center" sx={{ opacity: 0.6 }}>
              {isOwnProfile ? ownUsername : profile?.username}
            </Typography>
          </Box>
          <Divider />
          <Box py={3}>
            <Typography fontSize={16} fontWeight={5} paddingBottom={1}>
              Preferred Language
            </Typography>
            <Typography sx={{ opacity: 0.6 }}>
              {formatLanguage(
                isOwnProfile ? preferredLanguage : profile?.preferredLanguage.name ?? '',
              )}
            </Typography>
          </Box>
          {isOwnProfile && (
            <Button variant="contained" color="primary" onClick={handleEditProfile}>
              Edit profile
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
