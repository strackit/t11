import { GET_OFFER_PRODUCTS } from '../../queries/get.js';
import client from '../../../../utils/apolloClient.js';

export const getOfferProductsController = async (shopId) => {
  try {
    const variables = {
      filter: {
        shopId: Number(shopId),
        
      },
    };

    const response = await client.query({
      query: GET_OFFER_PRODUCTS,
      variables,
    });

    console.log('Raw Response:', JSON.stringify(response, null, 2));

    return response?.data?.offerProducts ?? [];
  } catch (error) {
    console.error('Error in controller:', error.message || error);
    throw error;
  }
};
