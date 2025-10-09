import client, { gql } from '../../../utils/apolloClient.js';

const ADD_REVIEW = gql`
  mutation Mutation($orderId: Int, $userId: Int, $productId: Int, $rating: Int, $review: String) {
    addReview(orderId: $orderId, userId: $userId, productId: $productId, rating: $rating, review: $review) {
      userId
      review
      rating
      productId
      orderId
      id
    }
  }
`;

export const addReview = async (input) => {
  try {
    const response = await client.mutate({
      mutation: ADD_REVIEW,
      variables: { ...input },
    });

    return response?.data?.addReview ?? null;
  } catch (error) {
    console.error('Error adding review:', error.message || error);
    throw error;
  }
};
