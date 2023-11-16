import { Outlet } from 'react-router-dom';
import MainMenuBar from '../navigation/MainMenuBar';
import ErrorBoundary from '../components/ErrorBoundary';
import { Box, Container } from '@mui/material';

// wraps all app pages
export default function AppWrapper() {
  return (
    <ErrorBoundary>
      <MainMenuBar />
      <Container>
        <Box my={10}>
          <Outlet />
        </Box>
      </Container>
    </ErrorBoundary>
  );
}
