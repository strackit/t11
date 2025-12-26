import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import '../styles/pages/Wishlist.css';

const HeartIconLarge = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-svg-icon">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useApp();

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="wishlist empty-state">
        <div className="empty-content">
          <span className="empty-icon"><HeartIconLarge /></span>
          <h2>Your wishlist is empty</h2>
          <p>Save items you love by clicking the heart icon</p>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist">
      <div className="page-header">
        <h1>My Wishlist</h1>
        <p>{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
      </div>

      <div className="wishlist-items">
        {wishlist.map((item) => (
          <div key={item.id} className="wishlist-item">
            <div className="item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="item-details">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-description">{item.description}</p>
              <p className="item-price">₹{item.price.toLocaleString()}</p>
            </div>
            <div className="item-actions">
              <button
                className="move-to-cart-btn"
                onClick={() => handleMoveToCart(item)}
              >
                Move to Cart
              </button>
              <button
                className="remove-btn"
                onClick={() => removeFromWishlist(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
