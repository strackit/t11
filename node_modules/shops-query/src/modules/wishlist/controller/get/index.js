import { fetchWishlist } from '../../queries/get.js';

/**
 * Controller to fetch wishlist items
 * @param {number} userId - User ID to filter wishlist
 * @returns {Promise<Array>} List of wishlist items
 */
// src/modules/wishlist/controller/get/index.js


export const getWishlistController = async (userId , shopid) => {
  try {
    const wishlist = await fetchWishlist(userId , shopid);
    console.log('Wishlist Items:', wishlist);
    return wishlist;
  } catch (error) {
    console.error('Controller failed to fetch wishlist:', error.message || error);
    throw error;
  }
};

