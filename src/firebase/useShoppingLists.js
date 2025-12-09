import { useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
    limit,
    serverTimestamp
} from 'firebase/firestore';
import { db, auth } from './config';

/**
 * Hook personalizado para gestionar listas de compras en Firestore
 * Proporciona sincronización en tiempo real con la base de datos
 */
export const useShoppingLists = () => {
    const [shoppingLists, setShoppingLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentUser = auth.currentUser;

    // Suscribirse a cambios en tiempo real - Solo listas del usuario
    useEffect(() => {
        if (!currentUser) {
            setShoppingLists([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        // Suscripción a listas propias
        const q = query(
            collection(db, 'shoppingLists'),
            where('owner', '==', currentUser.uid),
            limit(50)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const lists = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
                }));

                // Ordenar por fecha de creación (más reciente primero)
                // Nota: Firestore requiere índice compuesto para ordenar en la query con filtro
                // Hacemos el sort aquí para evitar configuración manual de índices por ahora
                lists.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setShoppingLists(lists);
                setLoading(false);
            },
            (err) => {
                console.error('Error fetching lists:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [currentUser]);

    // Crear nueva lista
    const createList = async (name) => {
        try {
            if (!currentUser) throw new Error('Usuario no autenticado');

            const newList = {
                name: name || `Lista ${shoppingLists.length + 1}`,
                createdAt: serverTimestamp(),
                owner: currentUser.uid,
                ownerEmail: currentUser.email?.toLowerCase() || '',
                items: []
            };

            const docRef = await addDoc(collection(db, 'shoppingLists'), newList);
            return docRef.id;
        } catch (err) {
            console.error('Error creating list:', err);
            setError(err.message);
            throw err;
        }
    };

    // Actualizar lista completa
    const updateList = async (listId, updates) => {
        try {
            const listRef = doc(db, 'shoppingLists', listId);
            await updateDoc(listRef, updates);
        } catch (err) {
            console.error('Error updating list:', err);
            setError(err.message);
            throw err;
        }
    };

    // Eliminar lista
    const deleteList = async (listId) => {
        try {
            await deleteDoc(doc(db, 'shoppingLists', listId));
        } catch (err) {
            console.error('Error deleting list:', err);
            setError(err.message);
            throw err;
        }
    };

    // Agregar item a una lista
    const addItemToList = async (listId, item) => {
        try {
            const list = shoppingLists.find(l => l.id === listId);
            if (!list) throw new Error('Lista no encontrada');

            const newItem = {
                ...item,
                id: Date.now(),
                checked: false
            };

            const updatedItems = [...list.items, newItem];
            await updateList(listId, { items: updatedItems });
        } catch (err) {
            console.error('Error adding item:', err);
            setError(err.message);
            throw err;
        }
    };

    // Actualizar item en una lista
    const updateItemInList = async (listId, itemId, updates) => {
        try {
            const list = shoppingLists.find(l => l.id === listId);
            if (!list) throw new Error('Lista no encontrada');

            const updatedItems = list.items.map(item =>
                item.id === itemId ? { ...item, ...updates } : item
            );

            await updateList(listId, { items: updatedItems });
        } catch (err) {
            console.error('Error updating item:', err);
            setError(err.message);
            throw err;
        }
    };

    // Eliminar item de una lista
    const deleteItemFromList = async (listId, itemId) => {
        try {
            const list = shoppingLists.find(l => l.id === listId);
            if (!list) throw new Error('Lista no encontrada');

            const updatedItems = list.items.filter(item => item.id !== itemId);
            await updateList(listId, { items: updatedItems });
        } catch (err) {
            console.error('Error deleting item:', err);
            setError(err.message);
            throw err;
        }
    };

    return {
        shoppingLists,
        loading,
        error,
        createList,
        updateList,
        deleteList,
        addItemToList,
        updateItemInList,
        deleteItemFromList
    };
};
