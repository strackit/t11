import { gql, client } from '../../../utils/apolloClient.js';

const GET_COUPONS_QUERY = gql`
  query GetCoupons($filter: couponFilter) {
    couponCode(filter: $filter) {
      id
      name
      description
      code
      validityFrom
      validityTo
      discount
      status
    }
  }
`;

export async function GET_COUPONS(filter = {}) {
  const { data } = await client.query({
    query: GET_COUPONS_QUERY,
    variables: { filter },
    fetchPolicy: 'no-cache',
  });
  return data.couponCode;
}
