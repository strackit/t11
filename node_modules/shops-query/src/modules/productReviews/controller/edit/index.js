import { editReview } from '../../mutations/edit.js';

/**
 * Controller to edit a review
 * @param {string|number} id - The ID of the review to be edited
 * @param {Object} input - Review update data
 * @returns {Promise<Object>} - Updated review details
 */
export const editReviewController = async (id, input) => {
  try {
    const review = await editReview(id, input);
    console.log('Review Edited:', review);
    return review;
  } catch (error) {
    console.error('Controller failed to edit review:', error.message || error);
    throw error;
  }
};
