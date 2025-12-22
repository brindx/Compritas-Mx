import { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    updateProfile,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from './config';

// Crear el contexto
const AuthContext = createContext({});

// Hook para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};

// Provider del contexto
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Registrar nuevo usuario
    const register = async (email, password, displayName) => {
        try {
            setError(null);
            const { user } = await createUserWithEmailAndPassword(auth, email, password);

            // Actualizar el perfil con el nombre
            await updateProfile(user, { displayName });

            // Enviar email de verificación
            await sendEmailVerification(user);

            return user;
        } catch (err) {
            console.error('Error en registro:', err);
            setError(getErrorMessage(err.code));
            throw err;
        }
    };

    // Iniciar sesión
    const login = async (email, password) => {
        try {
            setError(null);
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            return user;
        } catch (err) {
            console.error('Error en login:', err);
            setError(getErrorMessage(err.code));
            throw err;
        }
    };

    // Cerrar sesión
    const logout = async () => {
        try {
            setError(null);
            await signOut(auth);
        } catch (err) {
            console.error('Error en logout:', err);
            setError(getErrorMessage(err.code));
            throw err;
        }
    };

    // Escuchar cambios en el estado de autenticación
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loading,
        error,
        signup: register,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Función helper para mensajes de error en español
const getErrorMessage = (errorCode) => {
    const errorMessages = {
        'auth/email-already-in-use': 'Este correo ya está registrado',
        'auth/invalid-email': 'Correo electrónico inválido',
        'auth/operation-not-allowed': 'Operación no permitida',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
        'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
        'auth/user-not-found': 'No existe una cuenta con este correo',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
        'auth/network-request-failed': 'Error de red. Verifica tu conexión',
        'auth/requires-recent-login': 'Por seguridad, vuelve a iniciar sesión',
    };

    return errorMessages[errorCode] || 'Ocurrió un error. Intenta nuevamente';
};
