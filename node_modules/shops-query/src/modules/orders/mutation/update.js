import client , { gql } from '../../../utils/apolloClient.js';
export async function UPDATE_ORDER(id, input) {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation UpdateOrder($id: ID!, $input: orderInput!) {
          updateOrder(id: $id, input: $input) {
            id
            customerName
            customerAddress
            paymentInfo
          }
        }
      `,
      variables: { id, input }
    });
    return data.updateOrder;
  } catch (error) {
    console.error('Error in UPDATE_ORDER:', error);
    throw error;
  }
}
