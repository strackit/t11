import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/pages/Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, placeOrder } = useApp();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    const order = placeOrder();
    if (order) {
      setOrderPlaced(true);
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    }
  };

  if (orderPlaced) {
    return (
      <div className="cart empty-state">
        <div className="success-content">
          <span className="success-icon">✅</span>
          <h2>Order Placed Successfully!</h2>
          <p>Redirecting to orders...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart empty-state">
        <div className="empty-content">
          <span className="empty-icon">🛒</span>
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
        <p>{cart.length} item{cart.length !== 1 ? 's' : ''} in cart</p>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-price">₹{item.price.toLocaleString()}</p>
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
                  ₹{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
              <button
                className="remove-item-btn"
                onClick={() => removeFromCart(item.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="free-shipping">FREE</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>
          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
          <Link to="/" className="continue-link">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
