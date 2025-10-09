import client from '../../../utils/apolloClient.js';
import { GET_USER_ORDER_DETAILS } from '../queries/index.js';

export const fetchUserOrderDetails = async (userId, shopId) => {
  try {
    const { data } = await client.query({
      query: GET_USER_ORDER_DETAILS,
      variables: { filter: { userId: Number(userId), shopId: Number(shopId) } }
    });

    return data?.userOrderDetails || null;
  } catch (error) {
    console.error('Error fetching user order details:', error.message);
    throw error;
  }
};