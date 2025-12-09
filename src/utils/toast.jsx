import toast from 'react-hot-toast';

/**
 * Utilidades para Toast Notifications
 * Wrapper sobre react-hot-toast con configuración personalizada
 */

// Configuración base para todos los toasts
const baseConfig = {
    duration: 4000,
    position: 'top-right',
    style: {
        borderRadius: '12px',
        background: '#fff',
        color: '#1e293b',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
    },
};

export const showToast = {
    /**
     * Toast de éxito
     * @param {string} message - Mensaje a mostrar
     * @param {object} options - Opciones adicionales
     */
    success: (message, options = {}) => {
        return toast.success(message, {
            ...baseConfig,
            ...options,
            icon: '✓',
            style: {
                ...baseConfig.style,
                borderLeft: '4px solid #059669',
                ...options.style,
            },
        });
    },

    /**
     * Toast de error
     * @param {string} message - Mensaje a mostrar
     * @param {object} options - Opciones adicionales
     */
    error: (message, options = {}) => {
        return toast.error(message, {
            ...baseConfig,
            duration: 5000, // Errores duran más
            ...options,
            icon: '✕',
            style: {
                ...baseConfig.style,
                borderLeft: '4px solid #dc2626',
                ...options.style,
            },
        });
    },

    /**
     * Toast de advertencia
     * @param {string} message - Mensaje a mostrar
     * @param {object} options - Opciones adicionales
     */
    warning: (message, options = {}) => {
        return toast(message, {
            ...baseConfig,
            ...options,
            icon: '⚠️',
            style: {
                ...baseConfig.style,
                borderLeft: '4px solid #ea580c',
                ...options.style,
            },
        });
    },

    /**
     * Toast informativo
     * @param {string} message - Mensaje a mostrar
     * @param {object} options - Opciones adicionales
     */
    info: (message, options = {}) => {
        return toast(message, {
            ...baseConfig,
            ...options,
            icon: 'ℹ️',
            style: {
                ...baseConfig.style,
                borderLeft: '4px solid #0284c7',
                ...options.style,
            },
        });
    },

    /**
     * Toast de loading (promesa)
     * @param {Promise} promise - Promesa a ejecutar
     * @param {object} messages - Mensajes para cada estado
     */
    promise: (promise, messages = {}) => {
        return toast.promise(
            promise,
            {
                loading: messages.loading || 'Cargando...',
                success: messages.success || '✓ Completado',
                error: messages.error || '✕ Error',
            },
            {
                ...baseConfig,
                style: {
                    ...baseConfig.style,
                    borderLeft: '4px solid #3b82f6',
                },
            }
        );
    },

    /**
     * Toast personalizado con botones de acción
     * @param {string} message - Mensaje a mostrar
     * @param {function} onConfirm - Callback al confirmar
     * @param {function} onCancel - Callback al cancelar
     */
    confirm: (message, onConfirm, onCancel) => {
        return toast(
            (t) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <span>{message}</span>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                            onClick={() => {
                                onCancel?.();
                                toast.dismiss(t.id);
                            }}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0',
                                background: '#fff',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '600',
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => {
                                onConfirm?.();
                                toast.dismiss(t.id);
                            }}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: 'none',
                                background: '#3b82f6',
                                color: '#fff',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '600',
                            }}
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            ),
            {
                ...baseConfig,
                duration: Infinity, // Espera interacción del usuario
            }
        );
    },

    /**
     * Cerrar un toast específico
     * @param {string} toastId - ID del toast a cerrar
     */
    dismiss: (toastId) => {
        toast.dismiss(toastId);
    },

    /**
     * Cerrar todos los toasts
     */
    dismissAll: () => {
        toast.dismiss();
    },
};

// Exportar también el toast original para casos especiales
export { toast };

export default showToast;
