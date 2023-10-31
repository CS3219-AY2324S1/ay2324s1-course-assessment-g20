import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contextProviders/AuthContext';
import ThemeProvider from './theme';
import router from './routes';
import { ProfileProvider } from './contextProviders/ProfileContext';
import { SnackbarProvider } from 'notistack';

export default function App() {
  return (
    <ThemeProvider>
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
          <ProfileProvider>
            <RouterProvider router={router} />
          </ProfileProvider>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
