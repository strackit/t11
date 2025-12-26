import React, { createContext, useState, useContext, useEffect } from 'react';
import { products as mockProducts, banners as mockBanners } from '../data';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [user, setUser] = useState(null);
    const [categoryStructure, setCategoryStructure] = useState([]);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    // Static Initialization - UI Only
    useEffect(() => {
        // Mocking a short delay to simulate initial load for the spinner
        const timer = setTimeout(() => {
            const categories = [...new Set(mockProducts.map(p => p.category))];
            const structure = categories.map(cat => ({
                master: cat,
                subCategories: [
                    {
                        name: "All Items",
                        products: mockProducts.filter(p => p.category === cat)
                    }
                ]
            }));

            setCategoryStructure(structure);
            setBanners(mockBanners);
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    const login = (userData) => {
        setUser({ name: "Demo User", email: "demo@example.com" });
    };

    const logout = () => {
        setUser(null);
    };

    const addToCart = (product) => {
        setCart(prev => [...prev, { ...product, quantity: 1, cartItemId: Date.now() }]);
        alert(`${product.name} added to cart!`);
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const addToWishlist = (product) => {
        if (!wishlist.find(p => p.id === product.id)) {
            setWishlist(prev => [...prev, product]);
            alert(`${product.name} added to wishlist!`);
        }
    };

    const removeFromWishlist = (productId) => {
        setWishlist(prev => prev.filter(item => item.id !== productId));
    };

    const placeOrder = () => {
        alert("This is a UI demo. No actual order will be placed.");
    };

    return (
        <ShopContext.Provider value={{
            cart,
            wishlist,
            orders: [],
            user,
            categoryStructure,
            banners,
            loading,
            login,
            logout,
            addToCart,
            removeFromCart,
            addToWishlist,
            removeFromWishlist,
            placeOrder
        }}>
            {children}
        </ShopContext.Provider>
    );
};
