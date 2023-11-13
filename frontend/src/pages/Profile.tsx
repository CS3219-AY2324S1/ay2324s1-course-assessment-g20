import { useParams } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useEffect, useState } from 'react';
import { UserProfile } from '../@types/userProfile';
import ProfileBox from '../components/ProfileBox';
import { getUserProfileByUsername } from '../api/userApi';
import HistoryBox from '../components/HistoryBox';

export default function Profile() {
  const { username } = useParams();
  const { username: ownUsername, preferredLanguage, name } = useProfile();
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [profile, setProfile] = useState<UserProfile>();

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
  }, [isOwnProfile, ownUsername, username]);

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
