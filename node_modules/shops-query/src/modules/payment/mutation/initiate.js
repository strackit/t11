import { gql, client } from '../../../utils/apolloClient.js';

const INITIATE_PAYMENT_MUTATION = gql`
  mutation InitiatePayment(
    $amount: Int!
    $name: String!
    $number: String!
    $phonePeId: String!
    $phonePeKey: String!
    $domain: String!
  ) {
    initiatePayment(
      amount: $amount
      name: $name
      number: $number
      phonePeId: $phonePeId
      phonePeKey: $phonePeKey
      domain: $domain
    ) {
      success
      redirectUrl
      message
    }
  }
`;

export async function INITIATE_PAYMENT(vars) {
  const { data } = await client.mutate({
    mutation: INITIATE_PAYMENT_MUTATION,
    variables: vars, 
  });
  return data.initiatePayment;
}
