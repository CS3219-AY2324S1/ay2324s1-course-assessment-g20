import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contextProviders/AuthContext';
import ThemeProvider from './theme';
import router from './routes';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}
