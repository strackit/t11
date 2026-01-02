import { useState, useEffect } from 'react';
import { useApp } from '../../../shared/context/AppContext';
import { useShop } from '../../../shared/context/ShopContext';
import { OrderHistoryAPI } from '../../../shared/services/api';
import { Link } from 'react-router-dom';
import LoginModal from '../components/LoginModal';
import '../styles/pages/Orders.css';

const PackageIconLarge = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-svg-icon">
    <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const UserLockIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-svg-icon">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const LoadingSpinner = () => (
  <div className="orders-loading">
    <div className="spinner"></div>
    <p>Loading your orders...</p>
  </div>
);

const Orders = () => {
  const { isLoggedIn, user } = useApp();
  const { shopId } = useShop();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Helper to decode JWT and get userId
  const getUserIdFromToken = () => {
    try {
      if (!user || !user.auth_token) return null;
      const base64Url = user.auth_token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      return decoded?.user_id || null;
    } catch {
      return null;
    }
  };

  // Fetch order history from server
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isLoggedIn || !shopId) {
        setLoading(false);
        return;
      }

      const userId = getUserIdFromToken();
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const orderHistory = await OrderHistoryAPI.fetch(userId, shopId);
        
        // Map API response to expected format
        const formattedOrders = (orderHistory || []).map(order => ({
          id: order.id || order.orderId,
          orderId: order.orderId || `ORD-${order.id}`,
          date: order.orderDate || order.addedon || order.date || new Date().toISOString(),
          status: order.status || 'Confirmed',
          total: order.totalAmount || order.total || 0,
          items: (order.items || []).map(item => ({
            id: item.id || item.productId,
            productId: item.productId,
            name: item.name || item.productName || 'Product',
            image: item.featureImage || item.image || '/placeholder.png',
            price: item.prize || item.price || 0,
            quantity: item.quantity || 1
          }))
        }));

        setOrders(formattedOrders);
      } catch (err) {
        console.error('Error fetching order history:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn, shopId, user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('deliver')) return 'delivered';
    if (statusLower.includes('ship') || statusLower.includes('transit')) return 'processing';
    if (statusLower.includes('confirm') || statusLower.includes('placed')) return 'confirmed';
    if (statusLower.includes('cancel')) return 'cancelled';
    if (statusLower.includes('pending')) return 'pending';
    return 'confirmed';
  };

  // Show login prompt if user is not logged in
  if (!isLoggedIn) {
    return (
      <>
        <div className="orders empty-state">
          <div className="empty-content">
            <span className="empty-icon"><UserLockIcon /></span>
            <h2>Login to view your orders</h2>
            <p>Sign in to track your orders and view order history</p>
            <button 
              className="continue-shopping-btn" 
              onClick={() => setIsLoginModalOpen(true)}
            >
              Login to Continue
            </button>
          </div>
        </div>
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)} 
        />
      </>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="orders empty-state">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="orders empty-state">
        <div className="empty-content">
          <span className="empty-icon error-icon">⚠️</span>
          <h2>Unable to load orders</h2>
          <p>{error}</p>
          <button 
            className="continue-shopping-btn" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (orders.length === 0) {
    return (
      <div className="orders empty-state">
        <div className="empty-content">
          <span className="empty-icon"><PackageIconLarge /></span>
          <h2>No orders yet</h2>
          <p>Your order history will appear here</p>
          <Link to="/" className="continue-shopping-btn">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders">
      <div className="page-header">
        <h1>My Orders</h1>
        <p>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <span className="order-id">Order #{order.orderId || order.id}</span>
                <span className="order-date">{formatDate(order.date)}</span>
              </div>
              <div className={`order-status ${getStatusClass(order.status)}`}>
                {order.status}
              </div>
            </div>

            <div className="order-items">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div key={item.id || index} className="order-item">
                    <div className="item-image">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        onError={(e) => { e.target.src = '/placeholder.png'; }}
                      />
                    </div>
                    <div className="item-details">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">Qty: {item.quantity}</span>
                    </div>
                    <div className="item-price">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="order-item-placeholder">
                  <p>Order details not available</p>
                </div>
              )}
            </div>

            <div className="order-footer">
              <div className="order-total">
                <span>Order Total:</span>
                <span className="total-amount">₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
