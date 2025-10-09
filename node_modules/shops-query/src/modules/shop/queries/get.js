import { gql, client } from '../../../utils/apolloClient.js';

const GET_SHOPS = gql`
  query GetShops($filter: ShopInput) {
    shop(filter: $filter) {
      id
      name
      city
      state
      isOnline
    }
  }
`;

export async function GET_SHOP_LIST(filter) {
  const { data } = await client.query({
    query: GET_SHOPS,
    variables: { filter },
    fetchPolicy: 'no-cache',
  });

  return data.shop;
}
