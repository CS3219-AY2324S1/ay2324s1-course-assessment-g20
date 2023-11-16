import React, { useState } from 'react';
import { IAuth, IAuthContext } from '../@types/auth';

export const AuthContext = React.createContext<IAuthContext>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');

  const signout = () => {
    setUserId('');
    setIsAuthenticated(false);
  };

  const signIn = (auth: IAuth) => {
    setUserId(auth.userId);
    setIsAuthenticated(true);
  };

  const value = { isAuthenticated, userId, signIn, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
