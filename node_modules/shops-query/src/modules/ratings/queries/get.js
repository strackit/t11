import { gql, client } from '../../../utils/apolloClient.js';

export const GET_PRODUCT_REVIEWS = gql`
  query ProductReviews($filters: reviewFilter) {
    productReviews(filters: $filters) {
      id
      userId
      rating
      review
    }
  }
`;

/**
 * Fetch reviews for a single product.
 * @param {number} productId
 */
export async function GET_REVIEWS(productId) {
  const { data } = await client.query({
    query: GET_PRODUCT_REVIEWS,
    variables: {
      filters: { productId },
    },
    fetchPolicy: 'no-cache',
  });
  return data.productReviews;
}
