/**
 * Cart API Service
 * Wrapper for cart-related ShopsQuery calls
 */
import ShopsQuery from 'shops-query';

export const CartAPI = {
  /**
   * Add item to cart
   * @param {object} params - { productId, shopId, userId, quantity }
   */
  addItem: async ({ productId, shopId, userId, quantity }) => {
    return await ShopsQuery.cart.addToCart({
      productId,
      shopId,
      userId,
      quantity
    });
  },

  /**
   * Fetch cart for user
   * @param {object} params - { userId, shopId }
   */
  fetch: async ({ userId, shopId }) => {
    return await ShopsQuery.cart.fetchCart({ userId, shopId });
  }
};
