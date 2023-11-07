import { frontendPaths } from '../routes/paths';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import { formatLanguage } from '../utils/languageUtils';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../@types/userProfile';

function ProfileBox({
  isOwnProfile,
  name,
  ownUsername,
  preferredLanguage,
  profile,
}: {
  isOwnProfile: boolean;
  name: string;
  ownUsername: string;
  preferredLanguage: string;
  profile: UserProfile | undefined;
}) {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate(frontendPaths.editProfile);
  };
  return (
    <Box display="flex" flexDirection="column" alignItems="center" padding="2rem" minWidth="400px">
      <Paper elevation={3} sx={{ padding: '2rem', width: { xs: '100%', md: '60%' } }}>
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

export default ProfileBox;
