import { useState, useEffect } from 'react';
import { useApp } from '../../../shared/context/AppContext';
import { useShop } from '../../../shared/context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../../shared/constants';
import CheckoutModal from '../components/CheckoutModal';
import LoginModal from '../components/LoginModal';
import '../styles/pages/Cart.css';

const CartIconLarge = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-svg-icon">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="success-svg-icon">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const CloudIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
  </svg>
);

const OfflineIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, isLoggedIn, fetchServerCart } = useApp();
  const { shopId } = useShop();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [serverCart, setServerCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch cart from server if user is logged in
  useEffect(() => {
    const loadServerCart = async () => {
      if (isLoggedIn && shopId) {
        setLoading(true);
        try {
          const cartData = await fetchServerCart(shopId);
          setServerCart(cartData);
        } catch (err) {
          console.error('Error loading server cart:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setServerCart(null);
      }
    };

    loadServerCart();
  }, [isLoggedIn, shopId, fetchServerCart]);

  // Use server cart if logged in and has items, otherwise use local cart
  const hasServerCart = isLoggedIn && serverCart && serverCart.length > 0;
  const displayCart = hasServerCart ? serverCart : cart;
  const displayTotal = hasServerCart 
    ? serverCart.reduce((sum, item) => sum + (item.prize || 0) * item.quantity, 0)
    : cartTotal;

  const handlePlaceOrderClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handleOrderPlaced = (order) => {
    setPlacedOrder(order);
    setOrderPlaced(true);
    setIsCheckoutOpen(false);
    setTimeout(() => {
      navigate('/orders');
    }, 2500);
  };

  if (orderPlaced) {
    return (
      <div className="cart empty-state">
        <div className="success-content">
          <span className="success-icon"><CheckIcon /></span>
          <h2>Order Placed Successfully!</h2>
          <p>Order ID: #{placedOrder?.id || placedOrder?.orderId}</p>
          <p className="redirect-text">Redirecting to orders...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart empty-state">
        <div className="empty-content">
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (displayCart.length === 0) {
    return (
      <div className="cart empty-state">
        <div className="empty-content">
          <span className="empty-icon"><CartIconLarge /></span>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started</p>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="page-header">
        <h1>Shopping Cart</h1>
        <p>{displayCart.length} item{displayCart.length !== 1 ? 's' : ''} in cart</p>
      </div>

      <div className={`cart-source-indicator ${hasServerCart ? 'online' : 'offline'}`}>
        {hasServerCart ? (
          <><CloudIcon /> <span>Synced with server</span></>
        ) : (
          <><OfflineIcon /> <span>Local cart (login to sync)</span></>
        )}
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {displayCart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img src={getImageUrl(item.featureImage)} alt={item.name} />
              </div>
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-price">₹{item.prize.toLocaleString()}</p>
              </div>
              <div className="quantity-controls">
                <button
                  className="qty-btn"
                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                >
                  −
                </button>
                <span className="qty-value">{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <div className="item-total">
                <span className="total-label">Total</span>
                <span className="total-value">
                  ₹{(item.prize * item.quantity).toLocaleString()}
                </span>
              </div>
              <button
                className="remove-item-btn"
                onClick={() => removeFromCart(item.id)}
              >
                <CloseIcon />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{displayTotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="free-shipping">FREE</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{displayTotal.toLocaleString()}</span>
          </div>
          <button className="place-order-btn" onClick={handlePlaceOrderClick}>
            {isLoggedIn ? 'Proceed to Checkout' : 'Login to Checkout'}
          </button>
          <Link to="/" className="continue-link">
            ← Continue Shopping
          </Link>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={handleOrderPlaced}
        cartTotal={displayTotal}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default Cart;
