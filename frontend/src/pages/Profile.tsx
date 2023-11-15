import { useParams } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useEffect, useState } from 'react';
import { UserProfile } from '../@types/userProfile';
import ProfileBox from '../components/ProfileBox';
import { getUserProfileByUsername } from '../api/userApi';
import HistoryBox from '../components/HistoryBox';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function Profile() {
  const { username } = useParams();
  const { username: ownUsername, preferredLanguage, name } = useProfile();
  const [isOwnProfile, setIsOwnProfile] = useState(username === ownUsername);
  const [profile, setProfile] = useState<UserProfile>();
  const [profileExists, setProfileExists] = useState(true);

  useEffect(() => {
    setIsOwnProfile(username === ownUsername);
  }, [username, ownUsername]);

  useEffect(() => {
    if (!isOwnProfile) {
      const fetchAndSetProfile = async () => {
        try {
          const { data } = await getUserProfileByUsername(username ?? '');
          setProfileExists(true);
          setProfile(data);
        } catch (error) {
          setProfileExists(false);
          console.error(error);
        }
      };
      fetchAndSetProfile();
    }
  }, [isOwnProfile, username, profileExists]);

  if (!profileExists) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h4">The user you are looking for does not exist :(</Typography>
      </Box>
    );
  }

  if (!isOwnProfile && !profile) {
    return <CircularProgress />;
  }

  return (
    <>
      <ProfileBox
        isOwnProfile={isOwnProfile}
        name={name}
        ownUsername={ownUsername}
        preferredLanguage={preferredLanguage}
        profile={profile}
      />
      <hr />
      <br />
      <HistoryBox username={username ?? ''} />
    </>
  );
}
