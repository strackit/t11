import { createContext, useContext, useState, useEffect } from 'react';
import ShopQuery from 'shops-query';
import { getDomainName } from '../services/domainService';

const ShopContext = createContext();

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within ShopProvider');
  }
  return context;
};

export const ShopProvider = ({ children }) => {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check for shopId in URL query params first
        const urlParams = new URLSearchParams(window.location.search);
        const urlShopId = urlParams.get('shopId');
        
        let shopData;
        
        if (urlShopId) {
          // Fetch shop by ID from URL
          console.log('Fetching shop by ID from URL:', urlShopId);
          shopData = await ShopQuery.shop.fetchShops({
            id: urlShopId
          });
        } else {
          // Fall back to domain name
          const domainName = getDomainName();
          console.log('Fetching shop for domain:', domainName);
          shopData = await ShopQuery.shop.fetchShops({
            customDomain: domainName
          });
        }
        
        console.log('Shop data received:', shopData);
        

        // The API returns an array, we take the first shop
        if (shopData && shopData.length > 0) {
          setShop(shopData[0]);
        } else {
          setError('No shop found');
        }
      } catch (err) {
        console.error('Error fetching shop:', err);
        setError(err.message || 'Failed to fetch shop details');
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, []);

  // Derived values for convenience
  const shopId = shop?.id || null;
  const shopName = shop?.name || '';
  const isOnline = shop?.isOnline || false;

  // Update browser title with shop name
  useEffect(() => {
    if (shopName) {
      document.title = shopName;
    }
  }, [shopName]);

  return (
    <ShopContext.Provider
      value={{
        shop,
        shopId,
        shopName,
        isOnline,
        loading,
        error
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
