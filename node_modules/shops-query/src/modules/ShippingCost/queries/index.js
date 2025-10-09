import client ,{ gql } from '../../../utils/apolloClient.js';

export const GET_SHIPPING_COST = gql`
  query ShippingCost($filter: shippingFilter) {
    shippingCost(filter: $filter) {
      id
      shopId
      purchaseRange
      price
    }
  }
`;

export const getShippingCost = async (shopId) => {
  try {
    const response = await client.query({
      query: GET_SHIPPING_COST,
      variables: { filter: { shopId: Number(shopId) } }
    });
    return response?.data?.shippingCost ?? [];
  } catch (err) {
    console.error('Error fetching shipping costs:', err.message);
    throw err;
  }
};