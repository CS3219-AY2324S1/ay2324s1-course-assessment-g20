import React from 'react';
import { getBackendPath } from '../api/apiUtils';
import { IAuth, IAuthContext } from '../interfaces';
import { AUTH_TOKEN_LOCAL_STORAGE_KEY, backendServicesPaths } from '../utils/constants';
import { useLocalStorageState } from '../utils/hooks';

export const AuthContext = React.createContext<IAuthContext>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useLocalStorageState<IAuth | null>(
    AUTH_TOKEN_LOCAL_STORAGE_KEY,
    null,
  );

  const redirectToSignIn = () => {
    window.location.replace(getBackendPath(backendServicesPaths.auth.googleRedirect));
  };

  const signout = () => {
    setAuthState(null);
  };

  const signIn = (auth: IAuth) => {
    setAuthState(auth);
  };

  const value = { authState, redirectToSignIn, signIn, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
