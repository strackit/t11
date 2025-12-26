import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { cartCount, wishlist } = useApp();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏪' },
    { path: '/wishlist', label: 'Wishlist', icon: '❤️', count: wishlist.length },
    { path: '/cart', label: 'Cart', icon: '🛒', count: cartCount },
    { path: '/orders', label: 'Orders', icon: '📦' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🛍️</span>
          <span className="brand-text">ShopEase</span>
        </Link>

        <ul className="navbar-menu">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.count > 0 && (
                  <span className="nav-badge">{item.count}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
