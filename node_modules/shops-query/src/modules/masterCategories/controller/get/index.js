import client from '../../../../utils/apolloClient.js';
import { GET_MASTER_CATEGORIES } from '../../queries/get.js';

/**
 * Controller to fetch master categories
 * @param {number} shopId - Shop ID to filter categories
 * @returns {Promise<Array>} - Array of master category objects
 */
export const fetchMasterCategories = async (shopId) => {

  try {
    const { data } = await client.query({
      query: GET_MASTER_CATEGORIES,
      variables: { filter: { shopId: Number(shopId) } }
    });

    return data?.masterCategories || [];
  } catch (error) {
    console.error('Error in controller:', error.message);
    throw error;
  }
};