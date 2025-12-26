import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { products, categories } from '../data/products';
import '../styles/pages/Home.css';

const Home = () => {
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useApp();
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
        <h1>Welcome to ShopEase</h1>
        <p>Discover amazing products across categories</p>
      </div>

      <div className="categories-container">
        {categories.map((category) => (
          <div key={category.id} className="category-section">
            <button
              className={`category-header ${expandedCategories[category.id] ? 'expanded' : ''}`}
              onClick={() => toggleCategory(category.id)}
            >
              <div className="category-info">
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
                <span className="category-count">
                  ({getProductsByCategory(category.id).length} items)
                </span>
              </div>
              <span className="expand-icon">
                {expandedCategories[category.id] ? '▼' : '▶'}
              </span>
            </button>

            {expandedCategories[category.id] && (
              <div className="products-list">
                {getProductsByCategory(category.id).map((product) => (
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
                        {isInWishlist(product.id) ? '❤️' : '🤍'}
                      </button>
                      <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
