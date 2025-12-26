import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import '../styles/pages/Wishlist.css';

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
          <span className="empty-icon">❤️</span>
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
