import client , {gql} from '../../../utils/apolloClient.js';
import { GET_COUPON_CODE } from '../queries/index.js';

export const fetchCouponCode = async (shopId) => {
  try {
    const { data } = await client.query({
      query: GET_COUPON_CODE,
      variables: { filter: { shopId: Number(shopId) } }
    });

    return data?.couponCode || [];
  } catch (error) {
    console.error('Error fetching coupon codes:', error.message);
    throw error;
  }
};