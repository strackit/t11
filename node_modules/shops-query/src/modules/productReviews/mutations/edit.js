import client , {gql} from '../../../utils/apolloClient.js';

const EDIT_REVIEW = gql`
 mutation Mutation($orderId: Int, $userId: Int, $productId: Int, $rating: Int, $review: String) {
  editReview(orderId: $orderId, userId: $userId, productId: $productId, rating: $rating, review: $review) {
    userId
    review
    rating
    productId
    orderId
    id
  }
}
`;

export const editReview = async (input) => {
  try {
    const response = await client.mutate({
      mutation: EDIT_REVIEW,
      variables: {
        orderId: input.orderId,
        userId: input.userId,
        productId: input.productId,
        rating: input.rating,
        review: input.review,
      },
    });

    return response?.data?.editReview ?? null;
  } catch (error) {
    console.error('Error editing review:', error.message || error);
    throw error;
  }
};

