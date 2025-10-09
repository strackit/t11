import client ,  { gql } from '../../../utils/apolloClient.js';

export const GET_COUPON_CODE = gql`
  query CouponCode($filter: couponFilter) {
    couponCode(filter: $filter) {
      id
      shopId
      name
      description
      code
      validityFrom
      validityTo
      priceRange
      discount
      status
      userId
    }
  }
`;

export const getCouponCode = async (shopId) => {
  try {
    const response = await client.query({
      query: GET_COUPON_CODE,
      variables: { filter: { shopId: Number(shopId) } }
    });
    return response?.data?.couponCode ?? [];
  } catch (err) {
    console.error('Error fetching coupon codes:', err.message);
    throw err;
  }
};