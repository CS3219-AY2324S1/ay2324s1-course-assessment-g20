import React, { useLayoutEffect } from 'react';
import { IAuth, IAuthContext } from '../interfaces';
import { AUTH_TOKEN_LOCAL_STORAGE_KEY, backendServicesPaths } from '../utils/constants';
import { useLocalStorageState } from '../utils/hooks';
import authorizedAxios, {
  getRequestInterceptor,
  getResponseInterceptors,
} from '../api/axios/authorizedAxios';
import { getBackendPath } from '../utils/api';

export const AuthContext = React.createContext<IAuthContext>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useLocalStorageState<IAuth | null>(
    AUTH_TOKEN_LOCAL_STORAGE_KEY,
    null,
  );

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
  }, [authState]); // eslint-disable-line react-hooks/exhaustive-deps

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
