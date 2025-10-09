import client ,  { gql } from '../../../utils/apolloClient.js';

export const GET_SEARCH_FILTER = gql`
  query SearchFilter($filter: search) {
    searchFilter(filter: $filter) {
      id
      specValue {
        id
        name
        options {
          value
        }
      }
    }
  }
`;

export const getSearchFilter = async (shopId) => {
  try {
    const response = await client.query({
      query: GET_SEARCH_FILTER,
      variables: { filter: { shopId: Number(shopId) } }
    });
    return response?.data?.searchFilter ?? [];
  } catch (err) {
    console.error('Error fetching search filters:', err.message);
    throw err;
  }
};