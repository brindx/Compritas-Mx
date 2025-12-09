import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Sidebar from './Sidebar';
import MainPanel from './MainPanel';
import SkeletonDashboard from './SkeletonDashboard';
import { useShoppingLists } from '../firebase/useShoppingLists';

import { useMediaQuery } from '../hooks/useMediaQuery';

function Dashboard({ currentUser, onLogout }) {
    const isDesktop = useMediaQuery('(min-width: 1024px)');

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

    const [selectedListId, setSelectedListId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const body = document.body;
        if (sidebarOpen) {
            body.classList.add('no-scroll');
        } else {
            body.classList.remove('no-scroll');
        }
        return () => body.classList.remove('no-scroll');
    }, [sidebarOpen]);

    useEffect(() => {
        if (!loading && shoppingLists.length > 0 && !selectedListId) {
            setSelectedListId(shoppingLists[0].id);
        }
    }, [shoppingLists, loading, selectedListId]);

    const selectedList = shoppingLists.find(list => list.id === selectedListId);

    const handleSelectList = (listId) => {
        setSelectedListId(listId);
        setSidebarOpen(false);
    };

    const handleCreateList = async (name) => {
        try {
            const newListId = await createList(name);
            setSelectedListId(newListId);
            toast.success('Lista creada correctamente');
        } catch (err) {
            console.error('Error creating list:', err);
            toast.error('Error al crear la lista');
        }
    };

    const handleDeleteList = async (listId) => {
        try {
            await deleteList(listId);
            if (selectedListId === listId) {
                const remainingLists = shoppingLists.filter(list => list.id !== listId);
                if (remainingLists.length > 0) {
                    setSelectedListId(remainingLists[0].id);
                } else {
                    setSelectedListId(null);
                }
            }
            toast.success('Lista eliminada');
        } catch (err) {
            console.error('Error deleting list:', err);
            toast.error('Error al eliminar la lista');
        }
    };

    const handleAddItem = async (item) => {
        if (!selectedListId) return;
        try {
            await addItemToList(selectedListId, item);
            toast.success('Producto agregado');
        } catch (err) {
            console.error('Error adding item:', err);
            toast.error('Error al agregar el producto');
        }
    };

    const handleUpdateItem = async (itemId, updates) => {
        if (!selectedListId) return;
        try {
            await updateItemInList(selectedListId, itemId, updates);
        } catch (err) {
            console.error('Error updating item:', err);
            toast.error('Error al actualizar');
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!selectedListId) return;
        try {
            await deleteItemFromList(selectedListId, itemId);
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
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
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
                    selectedListId={selectedListId}
                    onSelectList={handleSelectList}
                    onCreateList={handleCreateList}
                    onDeleteList={handleDeleteList}
                    isOpen={sidebarOpen}
                />

                <MainPanel
                    list={selectedList}
                    onAddItem={handleAddItem}
                    onUpdateItem={handleUpdateItem}
                    onUpdateList={(updates) => updateList(selectedListId, updates)}
                    onDeleteItem={handleDeleteItem}
                />
            </div>
        </div>
    );
}

export default Dashboard;
