import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { products, categories } from '../data/products';
import '../styles/pages/Home.css';

// SVG Icons for Home page
const HeartIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const ChevronIcon = ({ expanded }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const Home = () => {
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist, getCartQuantity, updateCartQuantity } = useApp();
  const [expandedCategories, setExpandedCategories] = useState(
    categories.reduce((acc, cat) => ({ ...acc, [cat.id]: true }), {})
  );

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const getProductsByCategory = (categoryId) => {
    return products.filter((product) => product.category === categoryId);
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="home">
      <div className="page-header">
        <h1>Products</h1>
        <p>Browse our collection across categories</p>
      </div>

      <div className="categories-container">
        {categories.map((category) => (
          <div key={category.id} className="category-section">
            <button
              className={`category-header ${expandedCategories[category.id] ? 'expanded' : ''}`}
              onClick={() => toggleCategory(category.id)}
            >
              <div className="category-info">
                <span className="category-name">{category.name}</span>
                <span className="category-count">
                  {getProductsByCategory(category.id).length} items
                </span>
              </div>
              <span className="expand-icon">
                <ChevronIcon expanded={expandedCategories[category.id]} />
              </span>
            </button>

            <div className={`products-list-wrapper ${expandedCategories[category.id] ? 'expanded' : 'collapsed'}`}>
              <div className="products-list">
                {getProductsByCategory(category.id).map((product) => {
                  const cartQty = getCartQuantity(product.id);
                  
                  return (
                    <div key={product.id} className="product-row">
                      <div className="product-image">
                        <img src={product.image} alt={product.name} />
                      </div>
                      <div className="product-details">
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-description">{product.description}</p>
                        <p className="product-price">₹{product.price.toLocaleString()}</p>
                      </div>
                      <div className="product-actions">
                        <button
                          className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                          onClick={() => handleWishlistToggle(product)}
                          title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        >
                          <HeartIcon filled={isInWishlist(product.id)} />
                        </button>
                        
                        {cartQty > 0 ? (
                          <div className="quantity-controls">
                            <button 
                              className="qty-btn"
                              onClick={() => updateCartQuantity(product.id, cartQty - 1)}
                            >
                              <MinusIcon />
                            </button>
                            <span className="qty-value">{cartQty}</span>
                            <button 
                              className="qty-btn"
                              onClick={() => updateCartQuantity(product.id, cartQty + 1)}
                            >
                              <PlusIcon />
                            </button>
                          </div>
                        ) : (
                          <button
                            className="add-to-cart-btn"
                            onClick={() => addToCart(product)}
                          >
                            <PlusIcon />
                            <span>Add to Cart</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;


