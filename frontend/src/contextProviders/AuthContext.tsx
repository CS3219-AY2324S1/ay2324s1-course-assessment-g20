import React, { useLayoutEffect, useState } from 'react';
import { AUTH_TOKEN_LOCAL_STORAGE_KEY, backendServicesPaths } from '../utils/constants';
import authorizedAxios, {
  getRequestInterceptor,
  getResponseInterceptors,
} from '../api/axios/authorizedAxios';
import { getBackendPath } from '../utils/api';
import { readLocalStorage, setLocalStorage } from '../utils/localStorageHelper';
import { IAuth, IAuthContext } from '../@types/auth';

export const AuthContext = React.createContext<IAuthContext>(null!);

const getAuthStore = () => readLocalStorage<IAuth>(AUTH_TOKEN_LOCAL_STORAGE_KEY);
const setAuthStore = (authState: IAuth | null) =>
  setLocalStorage(AUTH_TOKEN_LOCAL_STORAGE_KEY, authState);
const checkIfAuthenticated = () => {
  const tokens = getAuthStore();
  return !!tokens?.accessToken && !!tokens.refreshToken;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  /**
   * Deliberate use of useState here so that axios interceptors still have access to
   * React render lifecycle during the unauthenticated auto-signout flow.
   * (see usages of `setIsAuthenticated` below)
   */
  const [isAuthenticated, setIsAuthenticated] = useState(checkIfAuthenticated());

  /**
   * useLayoutEffect as we want the axios interceptors to be set before triggering API
   * calls in the children components. Using useEffect will call the children's useEffects first,
   * before the one in AuthProvider.
   */
  useLayoutEffect(() => {
    const requestInterceptor = authorizedAxios.interceptors.request.use(
      getRequestInterceptor(value),
    );
    const responseInterceptor = authorizedAxios.interceptors.response.use(
      ...getResponseInterceptors(value),
    );
    return () => {
      authorizedAxios.interceptors.request.eject(requestInterceptor);
      authorizedAxios.interceptors.response.eject(responseInterceptor);
    };
  });

  const redirectToSignIn = () => {
    window.location.replace(getBackendPath(backendServicesPaths.auth.googleRedirect));
  };

  const signout = () => {
    setAuthStore(null);
    setIsAuthenticated(checkIfAuthenticated());
  };

  const signIn = (auth: IAuth) => {
    setAuthStore(auth);
    setIsAuthenticated(checkIfAuthenticated());
  };

  const value = { isAuthenticated, getAuthStore, redirectToSignIn, signIn, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
