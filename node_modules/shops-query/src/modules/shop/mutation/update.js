import { gql, client } from '../../../utils/apolloClient.js';

const UPDATE_SHOP = gql`
  mutation UpdateShop($id: Int!, $input: ShopInput!) {
    updateShop(id: $id, input: $input) {
      success
      message
    }
  }
`;

export async function UPDATE_SHOP_DETAILS(id, input) {
  const { data } = await client.mutate({
    mutation: UPDATE_SHOP,
    variables: { id, input },
  });

  return data.updateShop;
}
