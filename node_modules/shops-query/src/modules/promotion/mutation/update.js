import { gql, client } from '../../../utils/apolloClient.js';

const UPDATE_COUPON_MUTATION = gql`
  mutation UpdateCoupon($id: Int!, $input: CouponInput!) {
    updateCouponCode(id: $id, input: $input) {
      success
      message
    }
  }
`;

export async function UPDATE_COUPON(id, input) {
  const { data } = await client.mutate({
    mutation: UPDATE_COUPON_MUTATION,
    variables: { id, input },
  });
  return data.updateCouponCode;
}
