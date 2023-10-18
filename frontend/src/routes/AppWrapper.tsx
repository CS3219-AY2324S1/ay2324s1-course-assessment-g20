import { Outlet } from 'react-router-dom';
import MainMenuBar from '../navigation/MainMenuBar';
import { useAuth } from '../utils/hooks';
import ErrorBoundary from '../components/ErrorBoundary';
import { SnackbarProvider } from 'notistack';
import { Box, Container } from '@mui/material';

// wraps all app pages
export default function AppWrapper() {
  const authContext = useAuth();

  return (
    <SnackbarProvider maxSnack={3}>
      <ErrorBoundary>
        {authContext.isAuthenticated && <MainMenuBar />}
        <Container>
          <Box my={10}>
            <Outlet />
          </Box>
        </Container>
      </ErrorBoundary>
    </SnackbarProvider>
  );
}
