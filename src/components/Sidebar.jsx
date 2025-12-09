import { useState } from 'react';
import showToast from '../utils/toast';

import './Sidebar.css';

function Sidebar({ lists, selectedListId, onSelectList, onCreateList, onDeleteList, isOpen }) {
    const [isCreating, setIsCreating] = useState(false);
    const [newListName, setNewListName] = useState('');

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        if (newListName.trim()) {
            onCreateList(newListName.trim());
            setNewListName('');
            setIsCreating(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getListTotal = (list) => {
        // Solo suma productos NO completados (por comprar)
        return list.items
            .filter(item => !item.checked)
            .reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    };

    const getCompletedTotal = (list) => {
        // Total de productos ya comprados
        return list.items
            .filter(item => item.checked)
            .reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    };

    return (
        <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
            <div className="sidebar-header">
                <h2 className="sidebar-title">Mis Listas</h2>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setIsCreating(true)}
                    title="Nueva Lista"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Nueva Lista
                </button>
            </div>

            {/* Formulario para crear nueva lista */}
            {isCreating && (
                <div className="create-list-form slide-in">
                    <form onSubmit={handleCreateSubmit}>
                        <input
                            type="text"
                            placeholder="Nombre de la lista..."
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            autoFocus
                            className="list-name-input"
                        />
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary btn-sm">
                                Crear
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => {
                                    setIsCreating(false);
                                    setNewListName('');
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lista de listas de compras */}
            <div className="lists-container">
                {lists.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📝</div>
                        <p className="empty-state-title">No hay listas</p>
                        <p className="empty-state-description">
                            Crea tu primera lista para empezar
                        </p>
                    </div>
                ) : (
                    lists.map(list => (
                        <div
                            key={list.id}
                            className={`list-card ${selectedListId === list.id ? 'active' : ''}`}
                            onClick={() => onSelectList(list.id)}
                        >
                            <div className="list-card-content">
                                <div className="list-card-header">
                                    <h3 className="list-card-title">{list.name}</h3>
                                    <button
                                        className="delete-list-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            showToast.confirm(
                                                `¿Eliminar lista "${list.name}"?`,
                                                () => onDeleteList(list.id)
                                            );
                                        }}
                                        title="Eliminar lista"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                            <line x1="10" y1="11" x2="10" y2="17" />
                                            <line x1="14" y1="11" x2="14" y2="17" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="list-card-meta">
                                    <span className="list-date">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                        {formatDate(list.createdAt)}
                                    </span>
                                </div>

                                <div className="list-card-stats">
                                    <div className="stat">
                                        <span className="stat-value">{list.items.length}</span>
                                        <span className="stat-label">items</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-value stat-value-money">
                                            ${getListTotal(list).toFixed(2)}
                                        </span>
                                        <span className="stat-label">por comprar</span>
                                    </div>
                                </div>

                                {list.items.length > 0 && (
                                    <div className="list-card-progress">
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width: `${(list.items.filter(i => i.checked).length / list.items.length) * 100}%`
                                                }}
                                            />
                                        </div>
                                        <span className="progress-text">
                                            {list.items.filter(i => i.checked).length}/{list.items.length} completados
                                        </span>
                                    </div>
                                )}


                            </div>
                        </div>
                    ))
                )}
            </div>
        </aside>
    );
}

export default Sidebar;
