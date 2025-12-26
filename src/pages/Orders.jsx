import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import './Orders.css';

const Orders = () => {
  const { orders } = useApp();

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

  if (orders.length === 0) {
    return (
      <div className="orders empty-state">
        <div className="empty-content">
          <span className="empty-icon">📦</span>
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
                <span className="order-id">Order #{order.id}</span>
                <span className="order-date">{formatDate(order.date)}</span>
              </div>
              <div className={`order-status ${order.status.toLowerCase()}`}>
                {order.status}
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">Qty: {item.quantity}</span>
                  </div>
                  <div className="item-price">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
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
