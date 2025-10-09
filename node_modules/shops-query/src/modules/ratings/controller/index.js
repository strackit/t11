import { GET_REVIEWS }       from '../queries/get.js';
import { UPDATE_REVIEW }     from '../mutation/update.js';

export async function fetchReviews(productId) {
  return GET_REVIEWS(productId);
}

export async function updateReview(id, input) {
  return UPDATE_REVIEW(id, input);  
}
