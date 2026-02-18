import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Adjust path to your supabase config

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    // Helper to get the JWT and call Django
    const fetchWithAuth = async (url, options = {}) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;

        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
        };

        const response = await fetch(url, { ...options, headers });
        return response.json();
    };

    const fetchCart = async () => {
        setLoading(true);
        const data = await fetchWithAuth('http://localhost:8000/api/cart/'); // Adjust URL
        setCart(data);
        setLoading(false);
    };

    const addToCart = async (productId, quantity = 1) => {
        const data = await fetchWithAuth('http://localhost:8000/api/cart/', {
            method: 'POST',
            body: JSON.stringify({ product_id: productId, quantity }),
        });
        setCart(data);
    };

    const updateQuantity = async (itemId, quantity) => {
        const data = await fetchWithAuth(`http://localhost:8000/api/cart/update/${itemId}/`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity }),
        });
        setCart(data);
    };

    // Load cart on mount if user is logged in
    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);