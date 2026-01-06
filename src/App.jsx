import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import SkeletonDashboard from './components/SkeletonDashboard';
import { useAuth } from './firebase/AuthContext';
import './App.css';

// Componente envoltorio para animar la entrada/salida de páginas
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(5px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(5px)' }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ height: '100%', width: '100%' }}
    >
      {children}
    </motion.div>
  );
};

function App() {
  const { currentUser, loading, logout } = useAuth();
  const location = useLocation(); // Necesario para que AnimatePresence detecte el cambio de ruta

  if (loading) {
    return <SkeletonDashboard />;
  }

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            backdropFilter: 'blur(10px)',
            boxShadow: 'var(--shadow-md)',
          },
          success: {
            iconTheme: {
              primary: 'var(--success)',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--danger)',
              secondary: 'white',
            },
          },
        }}
      />

      {/* mode="wait" asegura que la página vieja salga antes de que entre la nueva */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* Ruta pública: Login/Registro */}
          <Route
            path="/login"
            element={
              !currentUser ? (
                <PageTransition>
                  <AuthPage />
                </PageTransition>
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Rutas protegidas: Dashboard Principal */}
          <Route
            path="/"
            element={
              currentUser ? (
                <PageTransition>
                  <Dashboard currentUser={currentUser} onLogout={logout} />
                </PageTransition>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Ruta para lista específica (Deep linking) */}
          <Route
            path="/lista/:listId"
            element={
              currentUser ? (
                <PageTransition>
                  <Dashboard currentUser={currentUser} onLogout={logout} />
                </PageTransition>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Cualquier otra ruta redirige al inicio */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
