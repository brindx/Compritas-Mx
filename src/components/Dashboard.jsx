import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom'; // 👈 Importamos hooks de routing
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import MainPanel from './MainPanel';
import SkeletonDashboard from './SkeletonDashboard';
import { useShoppingLists } from '../firebase/useShoppingLists';
import { useMediaQuery } from '../hooks/useMediaQuery';
import ThemeToggle from './ThemeToggle';

function Dashboard({ currentUser, onLogout }) {
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    // 1. Hooks de Routing
    const { listId } = useParams();
    const navigate = useNavigate();

    const {
        shoppingLists,
        loading,
        error,
        createList,
        deleteList,
        addItemToList,
        updateList,
        updateItemInList,
        deleteItemFromList
    } = useShoppingLists();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Bloquear scroll cuando el menú móvil está abierto
    useEffect(() => {
        const body = document.body;
        if (sidebarOpen) {
            body.classList.add('no-scroll');
        } else {
            body.classList.remove('no-scroll');
        }
        return () => body.classList.remove('no-scroll');
    }, [sidebarOpen]);

    // 2. Redirección inteligente: Si estamos en '/' y hay listas, ir a la primera
    useEffect(() => {
        if (!loading && shoppingLists.length > 0 && !listId) {
            navigate(`/lista/${shoppingLists[0].id}`, { replace: true });
        }
    }, [shoppingLists, loading, listId, navigate]);

    // 3. Determinar la lista seleccionada basada en la URL
    const selectedList = shoppingLists.find(list => list.id === listId);

    // Manejadores actualizados para usar navegación
    const handleSelectList = (id) => {
        navigate(`/lista/${id}`); // 👈 Actualiza la URL
        setSidebarOpen(false);
    };

    const handleCreateList = async (name) => {
        try {
            const newListId = await createList(name);
            navigate(`/lista/${newListId}`); // 👈 Navega a la nueva lista
            toast.success('Lista creada correctamente');
        } catch (err) {
            console.error('Error creating list:', err);
            toast.error('Error al crear la lista');
        }
    };

    const handleDeleteList = async (idToDelete) => {
        try {
            await deleteList(idToDelete);
            toast.success('Lista eliminada');

            // Si borramos la lista actual, ir al inicio (el useEffect nos redirigirá a otra)
            if (listId === idToDelete) {
                navigate('/');
            }
        } catch (err) {
            console.error('Error deleting list:', err);
            toast.error('Error al eliminar la lista');
        }
    };

    // Operaciones con items (usan listId directamente)
    const handleAddItem = async (item) => {
        if (!listId) return;
        try {
            await addItemToList(listId, item);
            toast.success('Producto agregado');
        } catch (err) {
            console.error('Error adding item:', err);
            toast.error('Error al agregar el producto');
        }
    };

    const handleUpdateItem = async (itemId, updates) => {
        if (!listId) return;
        try {
            await updateItemInList(listId, itemId, updates);
        } catch (err) {
            console.error('Error updating item:', err);
            toast.error('Error al actualizar');
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!listId) return;
        try {
            await deleteItemFromList(listId, itemId);
            toast.success('Producto eliminado');
        } catch (err) {
            console.error('Error deleting item:', err);
            toast.error('Error al eliminar');
        }
    };

    if (loading) {
        return <SkeletonDashboard />;
    }

    if (error) {
        return (
            <div className="error-screen">
                <div className="error-content">
                    <p className="error-message">Error: {error}</p>
                    <button className="btn btn-primary" onClick={() => window.location.reload()}>
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <header className="app-header">
                <div className="header-content">
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label="Abrir menú"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {sidebarOpen ? (
                                <path d="M18 6L6 18M6 6l12 12" />
                            ) : (
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            )}
                        </svg>
                    </button>

                    <div className="header-brand">
                        <h1 className="app-title">Compritas MX</h1>
                        <p className="app-subtitle">Gestor de Listas de Compras</p>
                    </div>

                    {isDesktop && (
                        <div className="header-stats">
                            <div className="stat-item">
                                <span className="stat-value">{shoppingLists.length}</span>
                                <span className="stat-label">Listas</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <span className="stat-value">
                                    {selectedList ? selectedList.items.length : 0}
                                </span>
                                <span className="stat-label">Productos</span>
                            </div>
                        </div>
                    )}

                    <div className="header-user">
                        <ThemeToggle />
                        <div className="user-info">
                            <span className="user-name">{currentUser.displayName || 'Usuario'}</span>
                            <span className="user-email">{currentUser.email}</span>
                        </div>
                        <button
                            onClick={onLogout}
                            className="btn btn-secondary btn-sm"
                            title="Cerrar sesión"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                            </svg>
                            Salir
                        </button>
                    </div>
                </div>
            </header>

            <div className="main-content">
                {sidebarOpen && (
                    <div
                        className="sidebar-overlay"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <Sidebar
                    lists={shoppingLists}
                    selectedListId={listId} // 👈 Pasamos el ID de la URL
                    onSelectList={handleSelectList}
                    onCreateList={handleCreateList}
                    onDeleteList={handleDeleteList}
                    isOpen={sidebarOpen}
                />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={listId ? listId : 'empty'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        style={{ display: 'flex', flex: 1, width: '100%', minWidth: 0 }}
                    >
                        <MainPanel
                            list={selectedList}
                            onAddItem={handleAddItem}
                            onUpdateItem={handleUpdateItem}
                            onUpdateList={(updates) => updateList(listId, updates)}
                            onDeleteItem={handleDeleteItem}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

export default Dashboard;
