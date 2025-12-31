/**
 * Shop API Service
 * Wrapper for shop-related ShopsQuery calls
 */
import ShopsQuery from 'shops-query';

export const ShopAPI = {
  /**
   * Fetch shop by ID
   * @param {string} id - Shop ID
   */
  fetchById: async (id) => {
    return await ShopsQuery.shop.fetchShops({ id });
  },

  /**
   * Fetch shop by custom domain
   * @param {string} customDomain - Domain name
   */
  fetchByDomain: async (customDomain) => {
    return await ShopsQuery.shop.fetchShops({ customDomain });
  }
};
