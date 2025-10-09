import { gql } from '../../../utils/apolloClient.js';

export const GET_CUSTOMER_MESSAGE = gql`
  query CustomerMessage($filter: message) {
    CustomerMessage(filter: $filter) {
      id
      shopId
      userId
      name
      mobile
      email
      subject
      message
      addedon
    }
  }
`;

export const getCustomerMessage = async (userId, shopId) => {
  try {
    const response = await client.query({
      query: GET_CUSTOMER_MESSAGE,
      variables: { filter: { userId: Number(userId), shopId: Number(shopId) } }
    });
    return response?.data?.CustomerMessage ?? [];
  } catch (err) {
    console.error('Error fetching customer messages:', err.message);
    throw err;
  }
};