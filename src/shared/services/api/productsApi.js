/**
 * Products API Service
 * Wrapper for product-related ShopsQuery calls
 */
import ShopsQuery from 'shops-query';

export const ProductsAPI = {
  /**
   * Get all products for a shop
   * @param {string} shopId - Shop ID
   */
  getAll: async (shopId) => {
    return await ShopsQuery.products.getProductsController(shopId);
  }
};
