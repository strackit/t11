import { GET_NESTED_CATEGORY } from '../../queries/get.js';
import client from '../../../../utils/apolloClient.js';

export const getNestedCategoryController = async (shopId) => {

  try {
    const response = await client.query({
      query: GET_NESTED_CATEGORY,
      variables: {
        filter: {
          shopId: Number(shopId),
        },
      },
    });

    return response?.data?.nestedCategory ?? [];
  } catch (error) {
    console.error('Controller failed to fetch nested category:', error.message || error);
    throw error;
  }
};