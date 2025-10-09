import client , {gql} from '../../../utils/apolloClient.js';

const GET_ORDERS_QUERY = gql`
  query Orders($filter: orderFilter) {
    orders(filter: $filter) {
      id
      itemNumber
      productName
      quantity
      tax
      prize
      discount
      description
      featureImage
      lastUpdate
      customerAddress
      timestamp
      status
      shopId
    }
  }
`;

export async function GET_ORDERS(filter) {
  const { data } = await client.query({
    query: GET_ORDERS_QUERY,
    variables: { filter }, 
    fetchPolicy: "no-cache",
  });
  return data.orders;
}
