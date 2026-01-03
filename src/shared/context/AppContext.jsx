import { createContext, useContext, useState, useEffect } from 'react';
import { CartAPI, OrderHistoryAPI } from '../services/api';

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
    try {
      const cookieData = getCookie("ualum");
      if (cookieData) {
        // Some versions store as JSON in cookie, some just the string
        let token = cookieData;
        try {
          cookieData = JSON.parse(cookieData);
          token = cookieData.auth;
        } catch (e) {
          token = cookieData.auth;
        }
        const decodedAuth = decodeJwt(token);
        return parseInt(decodedAuth.user_id || decodedAuth.userId || decodedAuth.id);
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  // Sync local cart to server
  const syncCartToServer = async (shopId) => {
    const userId = getUserIdFromToken();
    if (!userId || cart.length === 0) return;

    try {
      // Only sync items that don't have productId (local items)
      const localItems = cart.filter(item => !item.productId);

      for (const item of localItems) {
        await CartAPI.addItem({
          productId: item.id,
          shopId: shopId,
          userId: userId,
          quantity: item.quantity
        });
      }

      // Clear localStorage
      localStorage.removeItem('cart');

      // Fetch fresh cart from server and update state
      const serverCart = await CartAPI.fetch(userId, shopId);
      setCart(serverCart || []);

      console.log('Cart synced to server successfully');
    } catch (err) {
      console.error('Error syncing cart to server:', err);
    }
  };

  //Get Order Details
  const getOrderDetails = async (shopId) => {
    const userId = await getUserIdFromToken();
    if (!userId) return null;
    try {
      const orderDetails = await OrderHistoryAPI.fetch(userId, shopId);
      return orderDetails;
    } catch (err) {
      console.error('Error fetching order details:', err);
      return null;
    }
  };

  // Fetch cart from server
  const fetchServerCart = async (shopId) => {
    const userId = await getUserIdFromToken();
    if (!userId) return null;
    try {
      const serverCart = await CartAPI.fetch(userId, shopId);
      // Update local cart state with server cart
      if (serverCart) {
        setCart(serverCart);
      }
      return serverCart;
    } catch (err) {
      console.error('Error fetching cart from server:', err);
      return null;
    }
  };

  // Cart functions
  const addToCart = async (product, shopId, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    const userId = await getUserIdFromToken();
    if (userId) {
      await CartAPI.addItem({
        productId: product.id,
        shopId: shopId,
        userId: userId,
        quantity: quantity
      });
    }
  };

  const removeFromCart = async (item, shopId) => {
    const userId = getUserIdFromToken();
    const productIdToRemove = item.productId || item.id;

    if (userId) {
      await CartAPI.remove({ userId, productId: productIdToRemove, shopId });
    }

    // Remove from local cart state
    setCart((prev) => prev.filter((cartItem) => {
      const cartProductId = cartItem.productId || cartItem.id;
      return cartProductId !== productIdToRemove;
    }));
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
    const item = cart.find((item) => item.id === productId || item.productId === productId);
    return item ? (item.quantity || 0) : 0;
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

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.prize || item.price || 0;
    const quantity = item.quantity || 0;
    return sum + (price * quantity);
  }, 0);

  const cartCount = cart.reduce((sum, item) => {
    const quantity = item.quantity || 0;
    return sum + quantity;
  }, 0);

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
        getOrderDetails,
        cartTotal,
        cartCount,
        getCartQuantity,
        theme,
        toggleTheme,
        getUserIdFromToken
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
