import client, { gql } from '../../../utils/apolloClient.js';

export const GET_ADDRESS = gql`
  query GetAddress($filter: addressFilter) {
    address(filter: $filter) {
      id
      userId
      type
      country
      state
      city
      street
      pincode
      phone
      name
      status
    }
  }
`;

export const fetchAddress = async (filter = {}) => {
  try {
    const { data, errors } = await client.query({
      query: GET_ADDRESS,
      variables: { filter },
      fetchPolicy: 'network-only'
    });

    if (errors) {
      throw new Error(errors.map(e => e.message).join(', '));
    }

    return data?.address || [];
  } catch (error) {
    console.error("Error fetching addresses:", error);
    throw new Error(`Failed to fetch addresses: ${error.message}`);
  }
};