import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '../api/userApi';
import { UpdateUserProfile } from '../@types/userProfile';
import { IProfileContext } from '../@types/userProfile';

export const ProfileContext = React.createContext<IProfileContext>(null!);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [preferredLanguageId, setPreferredLanguageId] = useState<number>(1);
  const [preferredLanguage, setPreferredLanguage] = useState<string>('');
  const [roleId, setRoleId] = useState<number>(2);
  const [isMaintainer, setIsMaintainer] = useState<boolean>(false);
  const [isProfileFetched, setIsProfileFetched] = useState<boolean>(false);

  // Prioritise fetching profile before all other API calls in child components
  useLayoutEffect(() => {
    fetchAndSetProfile();
  }, []);

  const fetchAndSetProfile = useCallback(async () => {
    await getUserProfile()
      .then(({ data }) => {
        setName(data.name ?? '');
        setUsername(data.username ?? '');
        setPreferredLanguageId(data.preferredLanguage?.id ?? 1);
        setPreferredLanguage(data.preferredLanguage?.name ?? 'JavaScript');
        setRoleId(data.role?.id ?? 2);
        setIsMaintainer(data.role?.name === 'MAINTAINER');
        setIsProfileFetched(true);
      })
      .catch((error) => {
        console.error(error);
      });
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
      }
    } catch (error) {
      console.error('There was a problem deleting the user: ', error);
    }
  };

  const isOnboarded = useMemo(
    () => (isProfileFetched ? !!username && username.length > 0 : true),
    [username, isProfileFetched],
  );

  const value = {
    name,
    username,
    preferredLanguageId,
    preferredLanguage,
    roleId,
    isMaintainer,
    isOnboarded,
    updateProfile,
    deleteProfile,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
