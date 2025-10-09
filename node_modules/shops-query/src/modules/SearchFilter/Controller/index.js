import client from '../../../utils/apolloClient.js';
import { GET_SEARCH_FILTER } from '..//queries/index.js';

export const fetchSearchFilter = async (shopId) => {
  try {
    const { data } = await client.query({
      query: GET_SEARCH_FILTER,
      variables: { filter: { shopId: Number(shopId) } }
    });

    return data?.searchFilter || [];
  } catch (error) {
    console.error('Error fetching search filters:', error.message);
    throw error;
  }
};