import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/components/FloatingCartButton.css';

const CartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const FloatingCartButton = () => {
  const { cartCount, cartTotal } = useApp();
  const location = useLocation();

  // Don't show on cart page
  if (location.pathname === '/cart' || cartCount === 0) {
    return null;
  }

  return (
    <Link to="/cart" className="floating-cart-btn">
      <div className="floating-cart-icon">
        <CartIcon />
        <span className="floating-cart-badge">{cartCount}</span>
      </div>
      <div className="floating-cart-info">
        <span className="floating-cart-label">View Cart</span>
        <span className="floating-cart-total">₹{cartTotal.toLocaleString()}</span>
      </div>
    </Link>
  );
};

export default FloatingCartButton;
