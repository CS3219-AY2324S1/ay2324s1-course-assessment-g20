import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

  useEffect(() => {
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
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const updateProfile = async (newProfile: UpdateUserProfile) => {
    try {
      const response = await updateUserProfile(newProfile);
      if (response.status === 200) {
        await fetchAndSetProfile();
        return response.data;
      } else {
        throw new Error('Error occurred when updating profile');
      }
    } catch (error) {
      throw new Error('Error occurred when updating profile');
    }
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

  const isOnboarded = useMemo(() => username.length > 0, [username]);

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
