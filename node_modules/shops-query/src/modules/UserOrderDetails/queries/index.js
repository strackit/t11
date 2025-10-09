import client , { gql } from '../../../utils/apolloClient.js';

export const GET_USER_ORDER_DETAILS = gql`
  query UserOrderDetails($filter: userdetails) {
    userOrderDetails(filter: $filter) {
      creditPoints
      lastOrderAddress
    }
  }
`;

export const getUserOrderDetails = async (userId, shopId) => {
  try {
    const response = await client.query({
      query: GET_USER_ORDER_DETAILS,
      variables: { filter: { userId: Number(userId), shopId: Number(shopId) } }
    });
    return response?.data?.userOrderDetails ?? null;
  } catch (err) {
    console.error('Error fetching user order details:', err.message);
    throw err;
  }
};