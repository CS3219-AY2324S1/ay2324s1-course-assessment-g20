import { AuthProvider } from './contextProviders/AuthContext';
import PeerPrepRouterProvider from './routes';

export default function App() {
  return (
    <AuthProvider>
      <PeerPrepRouterProvider />
    </AuthProvider>
  );
}
