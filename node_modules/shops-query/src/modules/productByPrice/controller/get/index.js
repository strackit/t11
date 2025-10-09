import { fetchProductsByPrice } from '../../queries/get.js';

export const getProductsByPriceController = async (minPrice, maxPrice) => {
  try {
    const products = await fetchProductsByPrice({ minPrice, maxPrice });
    return products;
  } catch (error) {
    console.error('Controller failed to fetch products by price:', error);
  }
};
