import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../api/userApi';
import { UpdateUserProfile } from '../@types/userProfile';
import { useSnackbar } from 'notistack';
import { IProfileContext } from '../@types/userProfile';

export const ProfileContext = React.createContext<IProfileContext>(null!);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  /* 
    Values in Profile Context:
    Name
    Preferred Language
    Role
  */
  const [name, setName] = useState<string>('');
  const [preferredLanguageId, setPreferredLanguageId] = useState<number>(1);
  const [roleId, setRoleId] = useState<number>(2);
  const [isMaintainer, setIsMaintainer] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchAndSetProfile = async () => {
      await getUserProfile().then(({ data }) => {
        setName(data.name ?? '');
        setPreferredLanguageId(data.preferredLanguage?.id ?? 1);
        setRoleId(data.role?.id ?? 2);
        setIsMaintainer(data.role?.name === 'MAINTAINER');
      });
    }
    fetchAndSetProfile();
  }, []);

  const updateProfile = (newProfile: UpdateUserProfile) => {
    updateUserProfile(newProfile)
    .then((res) => {
      if (res.status === 200) {
        enqueueSnackbar('Profile updated!', { variant: 'success' })
        if (newProfile.name) {
          setName(newProfile.name);
        }
        if (newProfile.preferredLanguageId) {
          setPreferredLanguageId(newProfile.preferredLanguageId);
        }
      } else {
        enqueueSnackbar('Error when updating profile', { variant: 'error' })
      }
    })
    .catch(() => {
      enqueueSnackbar('Error when updating profile', { variant: 'error' })
    });
  }

  const value = { name, preferredLanguageId, roleId, isMaintainer, updateProfile }

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
