import client , { gql } from '../../../utils/apolloClient.js';

export const GET_STATE = gql`
  query Getstate($filter: pincodeFilter) {
    getstate(filter: $filter) {
      pinCode
      district
      state
      name
      region
      division
    }
  }
`;

export const getState = async (pincode) => {
  try {
    const response = await client.query({
      query: GET_STATE,
      variables: { filter: { pincode } }
    });
    return response?.data?.getstate ?? null;
  } catch (err) {
    console.error('Error fetching state details:', err.message);
    throw err;
  }
};