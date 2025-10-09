import { searchProducts } from '../../queries/get.js';

/**
 * Controller to search products by keyword
 * @param {string} keyword - Search keyword
 * @param {number} [shopId=512] - Optional shop ID (default: 512)
 * @returns {Promise<Array>} - List of search results
 */
export const searchProductsController = async (keyword, shopId = 512) => {
  try {
    const results = await searchProducts(keyword, shopId);
    return results;
  } catch (error) {
    console.error('Controller failed to search products:', error.message);
    throw error;
  }
};