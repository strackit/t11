import client , {gql} from '../../../utils/apolloClient.js';
import { GET_STATE } from '../queries/index.js';

export const fetchState = async (pincode) => {
  try {
    const { data } = await client.query({
      query: GET_STATE,
      variables: { filter: { pincode } }
    });

    return data?.getstate || null;
  } catch (error) {
    console.error('Error fetching state details:', error.message);
    throw error;
  }
};