import React from 'react';
import { AuthContext } from '../contextProviders/AuthContext';

export function useAuth() {
  return React.useContext(AuthContext);
}
