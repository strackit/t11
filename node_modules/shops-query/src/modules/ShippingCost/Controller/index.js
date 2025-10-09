import client , {gql} from '../../../utils/apolloClient.js';
import { GET_SHIPPING_COST } from '../queries/index.js';

export const fetchShippingCost = async (shopId) => {
  try {
    const { data } = await client.query({
      query: GET_SHIPPING_COST,
      variables: { filter: { shopId: Number(shopId) } }
    });

    return data?.shippingCost || [];
  } catch (error) {
    console.error('Error fetching shipping costs:', error.message);
    throw error;
  }
};