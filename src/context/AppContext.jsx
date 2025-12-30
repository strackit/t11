import { createContext, useContext, useState, useEffect } from 'react';
import ShopsQuery from 'shops-query';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });

  // Cookie helper functions
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      try {
        return JSON.parse(decodeURIComponent(parts.pop().split(';').shift()));
      } catch {
        return null;
      }
    }
    return null;
  };

  const setCookie = (name, value, days = 7) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/`;
  };

  const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  };

  const [user, setUserState] = useState(() => {
    return getCookie('ualum');
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Theme persistence and application
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // User functions
  const setUser = (userData) => {
    setUserState(userData);
    if (userData) {
      setCookie('ualum', userData, 7); // Store in cookie for 7 days
    } else {
      deleteCookie('ualum');
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isLoggedIn = !!user;

  // Decode JWT token to get payload
  const decodeJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error('Error decoding JWT:', err);
      return null;
    }
  };

  // Get user_id from JWT auth_token
  const getUserIdFromToken = () => {
    if (!user || !user.auth_token) return null;
    const decoded = decodeJwt(user.auth_token);
    return decoded?.user_id || null;
  };

  // Sync local cart to server
  const syncCartToServer = async (shopId) => {
    const userId = getUserIdFromToken();
    if (!userId || cart.length === 0) return;
    
    try {
      for (const item of cart) {
        await ShopsQuery.cart.addToCart({
          productId: item.id,
          shopId: shopId,
          userId: userId,
          quantity: item.quantity
        });
      }
      console.log('Cart synced to server successfully');
    } catch (err) {
      console.error('Error syncing cart to server:', err);
    }
  };

  // Fetch cart from server
  const fetchServerCart = async (shopId) => {
    const userId = getUserIdFromToken();
    if (!userId) return null;
    try {
      const serverCart = await ShopsQuery.cart.fetchCart({
        userId: userId,
        shopId: shopId
      });
      console.log('Fetched cart from server:', serverCart);
      return serverCart;
    } catch (err) {
      console.error('Error fetching cart from server:', err);
      return null;
    }
  };

  // Cart functions
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // Wishlist functions
  const addToWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.find((item) => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const getCartQuantity = (productId) => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Order functions
  const placeOrder = () => {
    if (cart.length === 0) return null;

    const order = {
      id: Date.now(),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.prize || 0) * item.quantity, 0),
      date: new Date().toISOString(),
      status: 'Confirmed'
    };

    setOrders((prev) => [order, ...prev]);
    clearCart();
    return order;
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.prize || 0) * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        cart,
        wishlist,
        orders,
        user,
        isLoggedIn,
        setUser,
        logout,
        syncCartToServer,
        fetchServerCart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        placeOrder,
        cartTotal,
        cartCount,
        getCartQuantity,
        theme,
        toggleTheme
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
