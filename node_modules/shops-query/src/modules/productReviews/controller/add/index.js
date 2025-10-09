import { addReview } from '../../mutations/add.js';

/**
 * Controller to add a product review
 * @param {Object} input - Review input (orderId, productId, rating, shopId, userId)
 * @returns {Promise<Object>} - Added review details
 */
export const addReviewController = async (input) => {
  try {
    const review = await addReview(input);
    console.log('Review added:', review);
    return review;
  } catch (error) {
    console.error('Controller failed to add review:', error.message || error);
    throw error;
  }
};

export default addReviewController;