import { createContext, useContext, useState, useEffect } from 'react';
import shopController from 'shops-query/src/modules/shop';
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
        
        const domainName = getDomainName();
        console.log('Fetching shop for domain:', domainName);
        
        const shopData = await shopController.fetchShops({
          customDomain: domainName
        });
        
        console.log('Shop data received:', shopData);
        

        // The API returns an array, we take the first shop
        if (shopData && shopData.length > 0) {
          setShop(shopData[0]);
        } else {
          setError('No shop found for this domain');
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
