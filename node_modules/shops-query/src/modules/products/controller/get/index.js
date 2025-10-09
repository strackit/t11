import { fetchProducts } from '../../queries/get.js';

export const getProductsController = async (shopId) => {
  return await fetchProducts({ shopId });
};

export const getProductByIdController = async (productId) => {
  return await fetchProducts({ productId });
};

export default {
  getProductsController,
  getProductByIdController
};