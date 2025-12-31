import { useState, useEffect } from 'react';
import { useApp } from '../../../shared/context/AppContext';
import { useShop } from '../../../shared/context/ShopContext';
import { ProductsAPI } from '../../../shared/services/api';
import { getImageUrl } from '../../../shared/constants';
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

// Lazy loading image component
const LazyImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className={`lazy-image-wrapper ${loaded ? 'loaded' : ''}`}>
      <div className="image-placeholder" />
      <img 
        src={src} 
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`lazy-image ${loaded ? 'visible' : ''}`}
      />
    </div>
  );
};

const Home = () => {
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist, getCartQuantity, updateCartQuantity } = useApp();
  const { shopId } = useShop();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Fetch all products using single API call
  useEffect(() => {
    const loadProducts = async () => {
      if (!shopId) return;
      
      try {
        setLoading(true);
        
        // Single API call to get all products
        const allProducts = await ProductsAPI.getAll(shopId);
        console.log('All products:', allProducts);
        
        if (allProducts && Array.isArray(allProducts)) {
          // Group products by secondary category
          const groupedByCategory = allProducts.reduce((acc, product) => {
            const categoryName = product.secondaryCategory || product.category || 'Other';
            if (!acc[categoryName]) {
              acc[categoryName] = {
                category: categoryName,
                products: []
              };
            }
            acc[categoryName].products.push(product);
            return acc;
          }, {});
          
          const categoriesArray = Object.values(groupedByCategory);
          console.log('Grouped categories:', categoriesArray);
          setCategories(categoriesArray);
          
          // Initialize expanded state - only first category is open
          const expandedState = categoriesArray.reduce((acc, cat, index) => ({ 
            ...acc, 
            [cat.category]: index === 0 
          }), {});
          setExpandedCategories(expandedState);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [shopId]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) {
    return (
      <div className="home">
        <div className="page-header">
          <h1>Products</h1>
          <p>Loading categories...</p>
        </div>
        <div className="categories-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="page-header">
        <h1>Products</h1>
        <p>Browse our collection across categories</p>
      </div>

      <div className="categories-container">
        {categories.map((cat) => {
          const categoryKey = cat.category || cat.id;
          return (
            <div key={categoryKey} className="category-section">
              <button
                className={`category-header ${expandedCategories[categoryKey] ? 'expanded' : ''}`}
                onClick={() => toggleCategory(categoryKey)}
              >
                <div className="category-info">
                  <span className="category-name">{cat.category || cat.name}</span>
                  <span className="category-count">
                    {cat.products?.length || 0} items
                  </span>
                </div>
                <span className="expand-icon">
                  <ChevronIcon expanded={expandedCategories[categoryKey]} />
                </span>
              </button>

              <div className={`products-list-wrapper ${expandedCategories[categoryKey] ? 'expanded' : 'collapsed'}`}>
                <div className="products-list">
                  {(cat.products || []).map((product) => {
                    const cartQty = getCartQuantity(product.id);
                  
                  return (
                    <div key={product.id} className="product-row">
                      <div className="product-image">
                        <LazyImage src={getImageUrl(product.featureImage)} alt={product.name} />
                      </div>
                      <div className="product-details">
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-description" dangerouslySetInnerHTML={{ __html: product.description }} />
                        <p className="product-price">₹{product.prize?.toLocaleString()}</p>
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
          );
        })}
      </div>
    </div>
  );
};

export default Home;
