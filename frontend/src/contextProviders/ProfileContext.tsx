import React, { useCallback, useState } from 'react';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '../api/userApi';
import { UpdateUserProfile } from '../@types/userProfile';
import { IProfileContext } from '../@types/userProfile';

export const ProfileContext = React.createContext<IProfileContext>(null!);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [preferredLanguageId, setPreferredLanguageId] = useState<number>(1);
  const [preferredLanguage, setPreferredLanguage] = useState<string>('');
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);

  const fetchAndSetProfile = useCallback(async (userId: string) => {
    setIsLoading(true);
    await getUserProfile(userId)
      .then(({ data }) => {
        setName(data.name ?? '');
        setUsername(data.username ?? '');
        setPreferredLanguageId(data.preferredLanguage?.id ?? 1);
        setPreferredLanguage(data.preferredLanguage?.name ?? 'JavaScript');
        setIsOnboarded(!!data.username && data.username.length > 0);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
    setIsLoading(false);
  }, []);

  const updateProfile = async (userId: string, newProfile: UpdateUserProfile) => {
    const response = await updateUserProfile(userId, newProfile);
    const updatedUserProfile = response.data;
    if (response.status === 200) {
      setName(updatedUserProfile.name ?? '');
      setUsername(updatedUserProfile.username ?? '');
      setPreferredLanguageId(updatedUserProfile.preferredLanguage?.id ?? 1);
      setPreferredLanguage(updatedUserProfile.preferredLanguage?.name ?? 'JavaScript');
      setIsOnboarded(!!updatedUserProfile.username && updatedUserProfile.username.length > 0);
      return updatedUserProfile;
    }
    throw new Error('Error updating profile');
  };

  const deleteProfile = async (userId: string) => {
    try {
      const response = await deleteUserProfile(userId);
      if (response.status === 200) {
        setName('');
        setUsername('');
        setPreferredLanguageId(1);
        setPreferredLanguage('');
        setIsOnboarded(false);
      }
    } catch (error) {
      console.error('There was a problem deleting the user: ', error);
    }
  };

  const value = {
    name,
    username,
    preferredLanguageId,
    preferredLanguage,
    isOnboarded,
    isLoading,
    updateProfile,
    deleteProfile,
    fetchAndSetProfile,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
