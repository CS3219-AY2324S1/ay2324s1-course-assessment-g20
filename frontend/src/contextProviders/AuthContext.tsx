import React from 'react';
import { IAuth, IAuthContext } from '../interfaces';
import {
  AUTH_TOKEN_STORAGE_KEY,
  backendServicesPaths,
  BACKEND_API_HOST,
  VERSION_PREFIX,
} from '../utils/constants';
import { useLocalStorageState } from '../utils/hooks';

export const AuthContext = React.createContext<IAuthContext>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useLocalStorageState<IAuth | null>(
    AUTH_TOKEN_STORAGE_KEY,
    null,
  );

  const redirectToSignIn = () => {
    window.location.replace(
      `${BACKEND_API_HOST}${VERSION_PREFIX}${backendServicesPaths.auth.googleRedirect}`,
    );
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
