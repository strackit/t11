import client , {gql} from '../../../utils/apolloClient.js';

const GET_REVIEWS_QUERY = gql`
  query ProductReviews($filters: reviewFilter) {
  productReviews(filters: $filters) {
    userId
    review
    rating
    productId
    orderId
    id
    UserInfo {
      customerName
      customerId
    }
  }
}
`;

export const fetchReviews = async (productId) => {
  try {
    const response = await client.query({
      query: GET_REVIEWS_QUERY,
      variables: {
        filters: {
          productId: Number(productId),
        },
      },
    });

    return response?.data?.productReviews ?? [];
  } catch (error) {
    console.error('Error fetching product reviews:', error.message || error);
    throw error;
  }
};
