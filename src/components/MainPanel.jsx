import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import confetti from 'canvas-confetti';

import showToast from '../utils/toast';
import './MainPanel.css';
import { CATEGORIES, COMMON_PRODUCTS } from '../data/products';

// Componente para cada fila ordenable - Animated!
// Componente para cada fila ordenable - Animated!
const SortableItem = ({ item, index, editingId, startEdit, onDeleteItem, handleToggleCheck, children }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: item.id });

    // CSS.Transform.toString(transform) returns undefined if transform is null
    // We only want to apply it if it exists (meaning the item is being sorted/dragged)
    // Otherwise, we let Framer Motion handle the transform for entrance/exit.
    const transformString = CSS.Transform.toString(transform);

    const style = {
        transform: transformString, // Dnd-kit logic
        transition,
        zIndex: isDragging ? 1000 : 'auto',
        position: 'relative',
        opacity: isDragging ? 0.5 : 1,
    };

    // Animation Variants
    const variants = {
        hidden: { opacity: 0, scale: 0.98, y: 10 },
        visible: (i) => ({
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.25,
                ease: "easeOut"
            }
        }),
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
    };

    // If transform exists (dnd-active), use style. Otherwise, let Framer animation run.
    const finalStyle = transform ? style : { ...style, transform: undefined };

    return (
        <motion.tr
            ref={setNodeRef}
            style={finalStyle}
            layout // Enable layout animations for reordering
            custom={index}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            className={`${item.checked ? 'row-checked' : ''} ${editingId === item.id ? 'row-editing' : ''}`}
        >
            <td className="col-drag" {...attributes} {...listeners}>
                <span className="material-symbols-outlined drag-handle" style={{ cursor: 'grab', color: '#94a3b8' }}>
                    drag_indicator
                </span>
            </td>
            {children}
        </motion.tr>
    );
};

const MainPanel = ({ list, onAddItem, onDeleteItem, onUpdateItem, onUpdateList }) => {
    const [newItem, setNewItem] = useState({ name: '', price: '', note: '', link: '', category: '' });
    const [editingId, setEditingId] = useState(null);
    const tableScrollRef = useRef(null);
    const prevItemsLength = useRef(list?.items?.length || 0);
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if (list?.items?.length > prevItemsLength.current && tableScrollRef.current) {
            tableScrollRef.current.scrollTo({
                top: tableScrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
        prevItemsLength.current = list?.items?.length || 0;
    }, [list?.items?.length]);

    if (!list) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="main-panel empty"
            >
                <div className="center-content">
                    <span className="material-symbols-outlined text-gray-400" style={{ fontSize: '64px' }}>shopping_cart_off</span>
                    <h2>Selecciona una lista</h2>
                    <p>Elige una lista del menú lateral para ver sus detalles</p>
                </div>
            </motion.div>
        );
    }

    const calculateTotal = () => {
        return list.items
            .filter(item => !item.checked)
            .reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    };

    const calculateProgress = () => {
        if (list.items.length === 0) return 0;
        const completedItems = list.items.filter(item => item.checked).length;
        return (completedItems / list.items.length) * 100;
    };

    const calculateSavings = () => {
        return list.items
            .filter(item => item.checked)
            .reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newItem.name.trim()) return;

        if (editingId) {
            onUpdateItem(editingId, newItem);
            setEditingId(null);
        } else {
            onAddItem(newItem);
        }

        setNewItem({ name: '', price: '', note: '', link: '', category: '' });
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        setNewItem({
            name: item.name,
            price: item.price,
            note: item.note || '',
            link: item.link || '',
            category: item.category || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNewItem({ name: '', price: '', note: '', link: '', category: '' });
    };

    const handleToggleCheck = (itemId, currentStatus) => {
        const newStatus = !currentStatus;
        onUpdateItem(itemId, { checked: newStatus });

        if (newStatus) {
            const allOthersChecked = list.items.every(item =>
                item.id === itemId || item.checked
            );

            if (allOthersChecked && list.items.length > 0) {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
                });
                showToast.success('¡Lista completada! 🎉');
            }
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (active.id !== over.id) {
            const oldIndex = list.items.findIndex((item) => item.id === active.id);
            const newIndex = list.items.findIndex((item) => item.id === over.id);
            const newItems = arrayMove(list.items, oldIndex, newIndex);
            onUpdateList({ items: newItems });
        }
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="main-panel"
        >
            {/* Header Section */}
            <div className="panel-header-section">
                <div className="header-titles">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={list.name}
                        className="main-title"
                    >
                        {list.name}
                    </motion.h1>
                    <p className="sub-title">Gestiona los artículos de tu lista de compras actual.</p>
                </div>

                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="total-card"
                >
                    <p className="total-label">Por Comprar</p>
                    <p className="total-amount">${calculateTotal().toFixed(2)}</p>

                    <div className="total-progress">
                        <div className="progress-bar-container">
                            <motion.div
                                className="progress-bar-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${calculateProgress()}%` }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            ></motion.div>
                        </div>
                        <div className="progress-info">
                            <span className="progress-text">
                                {list.items.filter(i => i.checked).length}/{list.items.length} completados
                            </span>
                            {calculateSavings() > 0 && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="savings-text"
                                >
                                    Comprado: ${calculateSavings().toFixed(2)}
                                </motion.span>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Add/Edit Item Form */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="add-product-container"
            >
                <h2 className="section-title">
                    {editingId ? 'Editar producto' : 'Añadir nuevo producto'}
                </h2>
                <form className="add-form" onSubmit={handleSubmit}>
                    <datalist id="product-suggestions">
                        {COMMON_PRODUCTS.map((prod) => (
                            <option key={prod.name} value={prod.name} />
                        ))}
                    </datalist>

                    <label className="form-group flex-wide">
                        <span className="label-text">Nombre del Producto</span>
                        <input
                            className="form-input"
                            list="product-suggestions"
                            placeholder="ej. Pan integral"
                            value={newItem.name}
                            onChange={(e) => {
                                const val = e.target.value;
                                let updates = { name: val };
                                const match = COMMON_PRODUCTS.find(p => p.name.toLowerCase() === val.toLowerCase());
                                if (match) {
                                    if (!newItem.price) updates.price = match.price.toString();
                                    if (!newItem.category) updates.category = match.category;
                                }
                                setNewItem(prev => ({ ...prev, ...updates }));
                            }}
                        />
                    </label>

                    <label className="form-group flex-medium">
                        <span className="label-text">Categoría</span>
                        <select
                            className="form-input"
                            value={newItem.category || ''}
                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        >
                            <option value="">Selecciona...</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.icon} {cat.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="form-group flex-narrow">
                        <span className="label-text">Precio</span>
                        <input
                            className="form-input"
                            type="number"
                            placeholder="$0.00"
                            step="0.01"
                            value={newItem.price}
                            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        />
                    </label>
                    <label className="form-group flex-medium">
                        <span className="label-text">Nota (Opcional)</span>
                        <input
                            className="form-input"
                            placeholder="Detalles..."
                            value={newItem.note}
                            onChange={(e) => setNewItem({ ...newItem, note: e.target.value })}
                        />
                    </label>
                    <label className="form-group flex-medium">
                        <span className="label-text">Enlace (Opcional)</span>
                        <input
                            className="form-input"
                            placeholder="https://..."
                            value={newItem.link}
                            onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                        />
                    </label>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {editingId && (
                            <motion.button whileTap={{ scale: 0.95 }} type="button" onClick={cancelEdit} className="btn-cancel" title="Cancelar edición">
                                <span className="material-symbols-outlined">close</span>
                            </motion.button>
                        )}
                        <motion.button whileTap={{ scale: 0.95 }} type="submit" className="btn-add" title={editingId ? 'Guardar cambios' : 'Agregar producto'}>
                            <span className="material-symbols-outlined">{editingId ? 'save' : 'add'}</span>
                        </motion.button>
                    </div>
                </form>
            </motion.div>

            {/* Products Table with Drag & Drop */}
            <motion.div
                className="products-list-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <div className="products-scroll-wrapper" ref={tableScrollRef}>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        onDragStart={handleDragStart}
                    >
                        <table className="products-table">
                            <thead>
                                <tr>
                                    <th className="col-drag" style={{ width: '40px' }}></th>
                                    <th className="col-checkbox">
                                        <span className="material-symbols-outlined">check_box_outline_blank</span>
                                    </th>
                                    <th className="col-product">Producto</th>
                                    <th className="col-link">Enlace</th>
                                    <th className="col-note">Nota</th>
                                    <th className="col-price">Precio</th>
                                    <th className="col-actions">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <SortableContext
                                    items={list.items.map(i => i.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <AnimatePresence mode="popLayout">
                                        {list.items.length === 0 ? (
                                            <motion.tr
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                key="empty-row"
                                            >
                                                <td colSpan="7" className="empty-row">
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.6, padding: '3rem' }}>
                                                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#cbd5e1' }}>
                                                            <circle cx="9" cy="21" r="1"></circle>
                                                            <circle cx="20" cy="21" r="1"></circle>
                                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                                        </svg>
                                                        <p style={{ marginTop: '1rem', fontSize: '1.2rem', fontWeight: 600, color: '#64748b' }}>Tu lista está vacía</p>
                                                        <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>¡Agrega productos para comenzar!</p>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ) : (
                                            list.items.map((item, index) => (
                                                <SortableItem
                                                    key={item.id}
                                                    item={item}
                                                    index={index} // Pass index for delay
                                                    editingId={editingId}
                                                    startEdit={startEdit}
                                                    onDeleteItem={onDeleteItem}
                                                    handleToggleCheck={handleToggleCheck}
                                                >
                                                    <td className="col-checkbox">
                                                        <label className="custom-checkbox-container" onClick={(e) => e.stopPropagation()}>
                                                            <input
                                                                type="checkbox"
                                                                checked={item.checked}
                                                                onChange={() => handleToggleCheck(item.id, item.checked)}
                                                            />
                                                            <motion.span
                                                                className="checkmark"
                                                                whileTap={{ scale: 0.8 }}
                                                            >
                                                                {item.checked && (
                                                                    <motion.svg
                                                                        viewBox="0 0 24 24"
                                                                        className="checkmark-icon"
                                                                        initial={{ scale: 0, opacity: 0 }}
                                                                        animate={{ scale: 1, opacity: 1 }}
                                                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                                                    >
                                                                        <polyline points="20 6 9 17 4 12" />
                                                                    </motion.svg>
                                                                )}
                                                            </motion.span>
                                                        </label>
                                                    </td>
                                                    <td className="col-product">
                                                        <div className="product-info-cell">
                                                            <span className="product-name">
                                                                {item.category && (
                                                                    <span className="category-icon" title={CATEGORIES.find(c => c.id === item.category)?.name}>
                                                                        {CATEGORIES.find(c => c.id === item.category)?.icon}
                                                                    </span>
                                                                )}
                                                                {item.name}
                                                            </span>
                                                            {item.category && (
                                                                <span className="category-badge">
                                                                    {CATEGORIES.find(c => c.id === item.category)?.name}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="col-link">
                                                        {item.link && (
                                                            <a
                                                                href={item.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="link-btn"
                                                                title="Ver enlace"
                                                            >
                                                                <span className="material-symbols-outlined">link</span>
                                                            </a>
                                                        )}
                                                    </td>
                                                    <td className="col-note">
                                                        <span className="product-note">{item.note || '-'}</span>
                                                    </td>
                                                    <td className="col-price">
                                                        <span className="product-price">${parseFloat(item.price || 0).toFixed(2)}</span>
                                                    </td>
                                                    <td className="col-actions">
                                                        <div className="action-buttons">
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                className="action-btn edit-btn"
                                                                onClick={() => startEdit(item)}
                                                                title="Editar"
                                                            >
                                                                <span className="material-symbols-outlined">edit</span>
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                className="action-btn delete-btn"
                                                                onClick={() => {
                                                                    showToast.confirm(
                                                                        `¿Eliminar ${item.name}?`,
                                                                        () => onDeleteItem(item.id)
                                                                    );
                                                                }}
                                                                title="Eliminar"
                                                            >
                                                                <span className="material-symbols-outlined">delete</span>
                                                            </motion.button>
                                                        </div>
                                                    </td>
                                                </SortableItem>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </SortableContext>
                            </tbody>
                        </table>
                    </DndContext>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default MainPanel;
