"use client"

// app/contexts/CartContext.tsx
import React, {createContext, useContext, useEffect, useState} from 'react';

interface CartItem {
    id: string;
    name: string;
    price: string;
    image: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
    items: [],
    addToCart: () => {
    },
    removeFromCart: () => {
    },
    updateQuantity: () => {
    },
    clearCart: () => {
    },
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load cart from localStorage on component mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Error parsing cart data:', e);
            }
        }
    }, []);

    // Save to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (item: CartItem) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === item.id);
            if (existingItem) {
                return prevItems.map(i =>
                    i.id === item.id ? {...i, quantity: i.quantity + 1} : i
                );
            }
            return [...prevItems, item];
        });
    };

    const removeFromCart = (id: string) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? {...item, quantity} : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    return (
        <CartContext.Provider value={{items, addToCart, removeFromCart, updateQuantity, clearCart}}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);