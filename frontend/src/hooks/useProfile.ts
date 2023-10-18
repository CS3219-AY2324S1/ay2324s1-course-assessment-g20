import { useContext } from 'react';
import { ProfileContext } from '../contextProviders/ProfileContext';

export function useProfile() {
  return useContext(ProfileContext);
}
