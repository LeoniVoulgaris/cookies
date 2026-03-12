import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const fetchWithAuth = async (url, options = {}) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;
        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
        };
        const response = await fetch(url, { ...options, headers });
        if (!response.ok) return null;
        if (response.status === 204) return null;
        return response.json();
    };

    const fetchCart = async () => {
        setLoading(true);
        const data = await fetchWithAuth('/api/cart/');
        setCart(data);
        setLoading(false);
    };

    const addToCart = async (productId, quantity = 1, customisation = null) => {
        const body = { product_id: productId, quantity };
        if (customisation) body.customisation = customisation;
        const data = await fetchWithAuth('/api/cart/', {
            method: 'POST',
            body: JSON.stringify(body),
        });
        if (data) setCart(data);
    };

    const updateQuantity = async (itemId, quantity) => {
        const data = await fetchWithAuth(`/api/cart/update/${itemId}/`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity }),
        });
        if (data) setCart(data);
    };

    const removeItem = async (itemId) => {
        const data = await fetchWithAuth(`/api/cart/update/${itemId}/`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity: 0 }),
        });
        if (data) setCart(data);
    };

    const clearCart = async () => {
        await fetchWithAuth('/api/cart/', { method: 'DELETE' });
        setCart(prev => prev ? { ...prev, items: [], total_price: '0.00' } : null);
    };

    const checkout = async (formData = {}) => {
        const data = await fetchWithAuth('/api/checkout/', {
            method: 'POST',
            body: JSON.stringify(formData),
        });
        if (data) await fetchCart();
        return data;
    };

    const createStripeSession = async (formData = {}) => {
        return await fetchWithAuth('/api/create-checkout-session/', {
            method: 'POST',
            body: JSON.stringify(formData),
        });
    };

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
                fetchCart();
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <CartContext.Provider value={{
            cart, loading,
            addToCart, updateQuantity, removeItem, clearCart, fetchCart, checkout, createStripeSession,
            isCartOpen, openCart, closeCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);