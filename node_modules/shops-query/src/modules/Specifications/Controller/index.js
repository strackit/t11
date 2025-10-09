import client , {gql} from '../../../utils/apolloClient.js';
import { GET_SPECIFICATIONS_BY_SHOP } from '../queries/index.js';

export const fetchSpecificationsByShop = async (shopId) => {
  try {
    const { data } = await client.query({
      query: GET_SPECIFICATIONS_BY_SHOP,
      variables: { filter: { shopId: Number(shopId) } }
    });

    return data?.getSpecificationsByShop || [];
  } catch (error) {
    console.error('Error fetching specifications:', error.message);
    throw error;
  }
};