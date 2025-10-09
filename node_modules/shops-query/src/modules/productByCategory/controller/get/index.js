import { fetchProductsByCategory } from '../../queries/get.js';

export const getProductsByCategoryController = async (masterCategory, shopId, secondaryCategory = null) => {
  try {
    const items = await fetchProductsByCategory(masterCategory, shopId, secondaryCategory);
    return items;
  } catch (error) {
    console.error('Controller failed to fetch products by category:', error.message);
    throw error;
  }
};