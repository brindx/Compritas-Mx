import { Toaster } from 'react-hot-toast';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import { useAuth } from './firebase/AuthContext';
import './App.css';

function App() {
  // Obtener el usuario actual
  const { currentUser, logout } = useAuth();

  // Si no hay usuario autenticado, mostrar página de login
  if (!currentUser) {
    return (
      <>
        <Toaster />
        <AuthPage />
      </>
    );
  }

  return (
    <>
      <Toaster />
      <Dashboard currentUser={currentUser} onLogout={logout} />
    </>
  );
}

export default App;
