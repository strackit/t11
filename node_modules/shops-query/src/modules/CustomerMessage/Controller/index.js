import client from '../../../utils/apolloClient.js';
import { GET_CUSTOMER_MESSAGE } from '../queries/index.js';

export const fetchCustomerMessage = async (userId, shopId) => {
  try {
    const { data } = await client.query({
      query: GET_CUSTOMER_MESSAGE,
      variables: { filter: { userId: Number(userId), shopId: Number(shopId) } }
    });

    return data?.CustomerMessage || [];
  } catch (error) {
    console.error('Error fetching customer messages:', error.message);
    throw error;
  }
};