import { RouterProvider } from 'react-router-dom';
import ThemeProvider from './theme';
import router from './routes';
import { SnackbarProvider } from 'notistack';

export default function App() {
  return (
    <ThemeProvider>
      <SnackbarProvider maxSnack={3}>
        <RouterProvider router={router} />
      </SnackbarProvider>
    </ThemeProvider>
  );
}
