import { useState, useEffect } from 'react';
import { useApp } from '../../../shared/context/AppContext';
import { useShop } from '../../../shared/context/ShopContext';
import { Link } from 'react-router-dom';
import LoginModal from '../components/LoginModal';
import '../styles/pages/Orders.css';

const PackageIconLarge = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-svg-icon">
    <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const UserLockIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-svg-icon">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="orders-loading">
    <div className="spinner"></div>
    <p>Loading your orders...</p>
  </div>
);

const Orders = () => {
  const { isLoggedIn, user, getOrderDetails } = useApp();
  const { shopId } = useShop();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState({});

  // Fetch order history from server
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isLoggedIn || !shopId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getOrderDetails(shopId);
        setOrders(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn, shopId, getOrderDetails]);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/60x60?text=Product';

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `https://s3.ap-south-1.amazonaws.com/business.strackit.com/${cleanPath}`;
  };

  const getStatusText = (status) => {
    if (status === 1) return 'Confirmed';
    if (status === 2) return 'Processing';
    if (status === 3) return 'Shipped';
    if (status === 4) return 'Delivered';
    if (status === 0) return 'Cancelled';
    return 'Pending';
  };

  const getStatusColor = (status) => {
    if (status === 4) return 'delivered';
    if (status === 3) return 'processing';
    if (status === 1 || status === 2) return 'confirmed';
    if (status === 0) return 'cancelled';
    return 'pending';
  };

  const calculateOrderTotal = (orderdetails) => {
    if (!orderdetails || orderdetails.length === 0) return 0;
    return orderdetails.reduce((total, item) => total + (item.totalPrice || 0), 0);
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
        {orders.map((order) => {
          const orderTotal = calculateOrderTotal(order.orderdetails);
          const itemCount = order.orderdetails?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
          const isExpanded = expandedOrders[order.id];

          return (
            <div key={order.id} className={`order-card ${isExpanded ? 'expanded' : ''}`}>
              {/* Order Summary Header */}
              <div
                className="order-summary-header"
                onClick={() => toggleOrderExpansion(order.id)}
              >
                <div className="order-header">
                  <div className="order-info">
                    <span className="order-id">Order #{order.voucherNo || order.id}</span>
                    <span className="order-date">{formatDate(order.timestamp)}</span>
                    <span className="order-meta">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'} • {order.orderType?.toUpperCase()}
                    </span>
                  </div>
                  <div className="order-header-right">
                    <div className={`order-status ${getStatusColor(order.orderdetails?.[0]?.status)}`}>
                      {getStatusText(order.orderdetails?.[0]?.status)}
                    </div>
                    <div className="order-total-preview">
                      <span className="total-label">Total:</span>
                      <span className="total-amount-preview">{formatCurrency(orderTotal)}</span>
                    </div>
                  </div>
                </div>

                <button className="accordion-toggle">
                  <svg
                    className={`chevron ${isExpanded ? 'rotated' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                </button>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="order-details-expanded">
                  <div className="order-delivery-info">
                    <h4 className="section-label">Delivery Information</h4>
                    <div className="delivery-address">
                      <strong>{order.customerName}</strong>
                      <p>{order.customerAddress}</p>
                      <p>Phone: {order.customerMobile}</p>
                    </div>
                  </div>

                  {order.orderdetails && order.orderdetails.length > 0 && (
                    <div className="order-items-section">
                      <h4 className="section-label">Order Items</h4>
                      <div className="order-items">
                        {order.orderdetails.map((item) => {
                          const product = item.Products?.[0];
                          return (
                            <div key={item.id} className="order-item">
                              <div className="item-image">
                                <img
                                  src={getImageUrl(product?.featureImage)}
                                  alt={product?.name}
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/60x60?text=Product';
                                  }}
                                />
                              </div>
                              <div className="item-details">
                                <span className="item-name">{product?.name || 'Product'}</span>
                                <span className="item-qty">Qty: {item.quantity}</span>
                                {item.discount > 0 && (
                                  <span className="item-discount">Discount: {formatCurrency(item.discount)}</span>
                                )}
                              </div>
                              <div className="item-price">
                                <span className="item-unit-price">
                                  {formatCurrency(item.price)} × {item.quantity}
                                </span>
                                <span className="item-total-price">
                                  {formatCurrency(item.totalPrice)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="order-footer">
                    <div className="order-total">
                      <span>Total Amount:</span>
                      <span className="total-amount">
                        {formatCurrency(orderTotal)}
                      </span>
                    </div>
                    {order.paymentInfo && order.paymentInfo !== "0" && (
                      <div className="payment-info">
                        Payment ID: {order.paymentInfo}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
