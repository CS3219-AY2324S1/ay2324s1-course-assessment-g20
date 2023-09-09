// import Login from './pages/Login';

import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { IAuth, IAuthContext } from './interfaces';
import router from './routes';
import { useLocalStorageState } from './utils/hooks';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export const AuthContext = React.createContext<IAuthContext>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useLocalStorageState<IAuth | null>('authState', null);

  const redirectToSignIn = () => {
    window.location.replace(`${import.meta.env.VITE_BACKEND_API_HOST}/v1/auth/google`);
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
