import { gql } from 'graphql-tag';
import { client } from '../../../utils/apolloClient.js';


const GET_IP_ADDRESS_QUERY = gql`
 query {
  getIpAddress {
    serverIpAddress
  }
}

`;

export async function GET_IPADDRESS() {
  try {
    const { data } = await client.query({
      query: GET_IP_ADDRESS_QUERY
    });
    return data.ipAddress;
  } catch (error) {
    console.error('Error in GET_IP_ADDRESS:', error);
    throw error;
  }
}
