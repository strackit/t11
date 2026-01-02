/**
 * Order History API Service
 * Wrapper for order history related ShopsQuery calls
 */
import ShopsQuery from 'shops-query';

export const OrderHistoryAPI = {
  /**
   * Fetch order history for a user
   * @param {number} userId - The user's ID
   * @param {number} shopId - The shop's ID
   * @returns {Promise<Array>} Array of order objects
   */
  fetch: async (userId, shopId) => {
    return await ShopsQuery.orderHistory.fetchOrderHistory(userId, shopId);
  },

  /**
   * Fetch detailed information about a specific order
   * @param {number} orderId - The order's ID
   * @returns {Promise<Object>} Order details object
   */
  fetchDetails: async (orderId) => {
    return await ShopsQuery.userOrderDetails.fetchUserOrderDetails(orderId);
  }
};
