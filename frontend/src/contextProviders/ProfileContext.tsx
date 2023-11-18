import React, { useCallback, useEffect, useState } from 'react';
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
  const [roleId, setRoleId] = useState<number>(2);
  const [isMaintainer, setIsMaintainer] = useState<boolean>(false);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);

  // Prioritise fetching profile before all other API calls in child components
  useEffect(() => {
    fetchAndSetProfile();
  }, []);

  const fetchAndSetProfile = useCallback(async () => {
    setIsLoading(true);
    await getUserProfile()
      .then(({ data }) => {
        setName(data.name ?? '');
        setUsername(data.username ?? '');
        setPreferredLanguageId(data.preferredLanguage?.id ?? 1);
        setPreferredLanguage(data.preferredLanguage?.name ?? 'JavaScript');
        setRoleId(data.role?.id ?? 2);
        setIsMaintainer(data.role?.name === 'MAINTAINER');
        setIsOnboarded(!!data.username && data.username.length > 0);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
    setIsLoading(false);
  }, []);

  const updateProfile = async (newProfile: UpdateUserProfile) => {
    const response = await updateUserProfile(newProfile);
    const updatedUserProfile = response.data;
    if (response.status === 200) {
      setName(updatedUserProfile.name ?? '');
      setUsername(updatedUserProfile.username ?? '');
      setPreferredLanguageId(updatedUserProfile.preferredLanguage?.id ?? 1);
      setPreferredLanguage(updatedUserProfile.preferredLanguage?.name ?? 'JavaScript');
      setRoleId(updatedUserProfile.role?.id ?? 2);
      setIsMaintainer(updatedUserProfile.role?.name === 'MAINTAINER');
      setIsOnboarded(!!updatedUserProfile.username && updatedUserProfile.username.length > 0);
      return updatedUserProfile;
    }
    throw new Error('Error updating profile');
  };

  const deleteProfile = async () => {
    try {
      const response = await deleteUserProfile();
      if (response.status === 200) {
        setName('');
        setUsername('');
        setPreferredLanguageId(1);
        setPreferredLanguage('');
        setRoleId(2);
        setIsMaintainer(false);
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
    roleId,
    isMaintainer,
    isOnboarded,
    isLoading,
    updateProfile,
    deleteProfile,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
