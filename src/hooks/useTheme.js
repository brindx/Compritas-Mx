// src/hooks/useTheme.js
import { useState, useEffect } from 'react';

export const useTheme = () => {
    // 1. Verificar preferencia guardada o del sistema
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;

        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    };

    const [theme, setTheme] = useState(getInitialTheme);

    // 2. Aplicar la clase al documento HTML cuando cambia el tema
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // 3. Función para alternar
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return { theme, toggleTheme };
};
