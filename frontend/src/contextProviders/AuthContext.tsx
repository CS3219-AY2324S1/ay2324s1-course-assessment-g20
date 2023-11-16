import React, { useState } from 'react';
import { AUTH_TOKEN_LOCAL_STORAGE_KEY } from '../utils/constants';
import { readLocalStorage, setLocalStorage } from '../utils/localStorageHelper';
import { IAuth, IAuthContext } from '../@types/auth';

export const AuthContext = React.createContext<IAuthContext>(null!);

const getAuthStore = () => readLocalStorage<IAuth>(AUTH_TOKEN_LOCAL_STORAGE_KEY);
const setAuthStore = (authState: IAuth | null) =>
  setLocalStorage(AUTH_TOKEN_LOCAL_STORAGE_KEY, authState);
const checkIfAuthenticated = () => {
  const tokens = getAuthStore();
  return !!tokens?.userId;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  /**
   * Deliberate use of useState here so that axios interceptors still have access to
   * React render lifecycle during the unauthenticated auto-signout flow.
   * (see usages of `setIsAuthenticated` below)
   */
  const [isAuthenticated, setIsAuthenticated] = useState(checkIfAuthenticated());

  const signout = () => {
    setAuthStore(null);
    setIsAuthenticated(checkIfAuthenticated());
  };

  const signIn = (auth: IAuth) => {
    setAuthStore(auth);
    setIsAuthenticated(checkIfAuthenticated());
  };

  const value = { isAuthenticated, getAuthStore, signIn, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
