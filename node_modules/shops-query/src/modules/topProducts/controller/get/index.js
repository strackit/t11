import { fetchTopProducts } from '../../queries/get.js';

/**
 * Controller to fetch top products
 * @returns {Promise<Array>} - List of top products
 */
export const getTopProductsController = async (shopId) => {
  try {
    const products = await fetchTopProducts(shopId);
    return products;
  } catch (error) {
    console.error('Controller failed to fetch top products:', error.message || error);
    throw error;
  }
};
