import { Outlet } from 'react-router-dom';
import MainMenuBar from '../navigation/MainMenuBar';
import { useAuth } from '../hooks/useAuth';
import ErrorBoundary from '../components/ErrorBoundary';
import { Box, Container } from '@mui/material';

// wraps all app pages
export default function AppWrapper() {
  const authContext = useAuth();

  return (
    <ErrorBoundary>
      {authContext.isAuthenticated && <MainMenuBar />}
      <Container>
        <Box my={10}>
          <Outlet />
        </Box>
      </Container>
    </ErrorBoundary>
  );
}
