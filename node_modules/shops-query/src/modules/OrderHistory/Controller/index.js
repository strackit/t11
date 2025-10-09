import client from '../../../utils/apolloClient.js';
import { GET_ORDER_HISTORY } from '../queries/index.js';

export const fetchOrderHistory = async (userId, shopId) => {
  try {
    const { data } = await client.query({
      query: GET_ORDER_HISTORY,
      variables: { filter: { userId: Number(userId), shopId: Number(shopId) } }
    });

    return data?.orderHistory || [];
  } catch (error) {
    console.error('Error fetching order history:', error.message);
    throw error;
  }
};