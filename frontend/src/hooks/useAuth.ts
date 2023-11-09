import { useContext } from 'react';
import { AuthContext } from '../contextProviders/AuthContext';

export function useAuth() {
  return useContext(AuthContext);
}
