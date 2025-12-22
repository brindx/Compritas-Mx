import { useState } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { toast } from 'react-hot-toast';
import './Auth.css';

import './Auth.css';

// Icon Components
const IconUser = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const IconMail = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

const IconLock = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        displayName: ''
    });
    const { login, signup, loading } = useAuth();

    const toggleMode = () => {
        setIsLogin(!isLogin);
        // Optional: clear form or keep data
        // setFormData({ email: '', password: '', confirmPassword: '', displayName: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLogin) {
            if (formData.password !== formData.confirmPassword) {
                return toast.error('Las contraseñas no coinciden');
            }
            if (formData.password.length < 6) {
                return toast.error('La contraseña debe tener al menos 6 caracteres');
            }
            if (!formData.displayName.trim()) {
                return toast.error('El nombre es obligatorio');
            }
        }

        try {
            setIsLoading(true); // Start loading
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await signup(formData.email, formData.password, formData.displayName);
            }
        } catch (error) {
            console.error(error);
            // Show meaningful error to user
            let errorMessage = 'Error al procesar la solicitud.';

            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = 'Correo o contraseña incorrectos.';
            } else if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Este correo ya está registrado. Intenta iniciar sesión.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'La contraseña es muy débil (mínimo 6 caracteres).';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'El formato del correo no es válido.';
            }

            toast.error(errorMessage);
        } finally {
            setIsLoading(false); // End loading
        }
    };

    return (
        <div className={`auth-container ${isLogin ? 'login-mode' : 'register-mode'}`}>
            <div className="auth-card">
                <div className="auth-header">
                    <div className="logo-section">
                        <div className="logo-circle">
                            <svg className="logo-icon-main" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                        </div>
                        <h1 className="auth-title">Compritas MX</h1>
                        <p className="auth-subtitle">
                            {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta gratuita'}
                        </p>
                    </div>
                </div>

                <div className="auth-body">
                    <form onSubmit={handleSubmit} className="auth-form">

                        {!isLogin && (
                            <div className="form-group fade-in">
                                <label>Nombre Completo</label>
                                <div className="input-wrapper">
                                    <IconUser />
                                    <input
                                        type="text"
                                        name="displayName"
                                        placeholder="Tu nombre completo"
                                        value={formData.displayName}
                                        onChange={handleChange}
                                        required={!isLogin}
                                        autoComplete="name"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label>Correo Electrónico</label>
                            <div className="input-wrapper">
                                <IconMail />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="hola@ejemplo.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Contraseña</label>
                            <div className="input-wrapper">
                                <IconLock />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="form-group fade-in">
                                <label>Confirmar Contraseña</label>
                                <div className="input-wrapper">
                                    <IconLock />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required={!isLogin}
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="spinner-dots">Cargando...</span>
                            ) : (
                                isLogin ? 'Ingresar' : 'Crear Cuenta'
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                            <button
                                type="button"
                                className="link-text"
                                onClick={toggleMode}
                                disabled={loading}
                            >
                                {isLogin ? 'Crear cuenta nueva' : 'Inicia sesión aquí'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
