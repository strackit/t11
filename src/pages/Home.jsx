import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useShop } from '../context/ShopContext';
import ShopQuery from 'shops-query';
import { getImageUrl } from '../constants';
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
  const { shopId } = useShop();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Fetch master categories and then secondary categories for each
  useEffect(() => {
    const loadCategories = async () => {
      if (!shopId) return;
      
      try {
        setLoading(true);
        
        // Step 1: Fetch master categories
        const masterCategories = await ShopQuery.mastercategories.fetchMasterCategories(shopId);
        console.log('Master categories:', masterCategories);
        
        if (masterCategories && Array.isArray(masterCategories)) {
          // Step 2: For each master category, fetch its secondary categories
          const categoriesWithSecondary = await Promise.all(
            masterCategories.map(async (masterCat) => {
              const secondaryCategories = await ShopQuery.SecondaryCategories.fetchSecondaryCategories(shopId, masterCat.id);
              console.log(`Secondary categories for ${masterCat.category}:`, secondaryCategories);
              
              return {
                masterCategory: masterCat.category,
                secondaryCategories: secondaryCategories || []
              };
            })
          );
          
          // Step 3: For each secondary category, fetch products using getProductsByCategoryController
          const allSecondaryWithProducts = await Promise.all(
            categoriesWithSecondary.flatMap((item) =>
              item.secondaryCategories.map(async (sec) => {
                const products = await ShopQuery.productbycategory.getProductsByCategoryController(
                  item.masterCategory,
                  shopId,
                  sec.category || sec.name
                );
                console.log(`Products for ${sec.category || sec.name}:`, products);
                
                return {
                  ...sec,
                  masterCategory: item.masterCategory,
                  products: products || []
                };
              })
            )
          );
          
          console.log('All secondary categories with products:', allSecondaryWithProducts);
          setCategories(allSecondaryWithProducts);
          
          // Initialize expanded state - only first category is open
          const expandedState = allSecondaryWithProducts.reduce((acc, cat, index) => ({ 
            ...acc, 
            [cat.category || cat.id]: index === 0 
          }), {});
          setExpandedCategories(expandedState);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
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
                        <img src={getImageUrl(product.featureImage)} alt={product.name} />
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
