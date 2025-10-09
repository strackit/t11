import client from '../../../utils/apolloClient.js';
import { GET_SECONDARY_CATEGORIES } from "../queries/index.js";

/**
 * Controller to fetch master categories
 * @param {number} shopId - Shop ID to filter categories
 * @param {number} masterCategoryId - MasterCategory ID to filter Secondary categories
 * @returns {Promise<Array>} - Array of master category objects
 */
export const fetchSecondaryCategories = async (shopId , masterCategoryId) => {

  try {
    const { data } = await client.query({
      query: GET_SECONDARY_CATEGORIES,
      variables: { filter: { shopId: Number(shopId), masterCategoryId: Number(masterCategoryId) } },
    });

    return data?.secondaryCategories || [];
  } catch (error) {
    console.error('Error in controller:', error.message);
    throw error;
  }
};