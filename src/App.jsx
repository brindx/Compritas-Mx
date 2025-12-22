import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import SkeletonDashboard from './components/SkeletonDashboard';
import { useAuth } from './firebase/AuthContext';
import './App.css';

function App() {
  // 1. Destructuramos 'logout' además de currentUser y loading
  const { currentUser, loading, logout } = useAuth();

  if (loading) {
    return <SkeletonDashboard />;
  }

  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
          },
        }}
      />
      <Routes>
        {/* Ruta pública: Login/Registro */}
        <Route
          path="/login"
          element={!currentUser ? <AuthPage /> : <Navigate to="/" />}
        />

        {/* Rutas protegidas: Dashboard */}
        <Route
          path="/"
          element={currentUser ? (
            // 2. ¡IMPORTANTE! Pasamos las props requeridas al Dashboard
            <Dashboard currentUser={currentUser} onLogout={logout} />
          ) : (
            <Navigate to="/login" />
          )}
        />

        {/* Ruta para lista específica (Deep linking) */}
        <Route
          path="/lista/:listId"
          element={currentUser ? (
            // 2. Aquí también pasamos las props
            <Dashboard currentUser={currentUser} onLogout={logout} />
          ) : (
            <Navigate to="/login" />
          )}
        />

        {/* Cualquier otra ruta redirige al inicio */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
