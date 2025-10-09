import client , {gql} from '../../../utils/apolloClient.js';

export const GET_MASTER_CATEGORIES = gql`
  query GetMasterCategories($filter: MasterCategoryInput) {
    masterCategories(filter: $filter) {
    status
    shopId
    position
    image
    id
    category
    addedon
    }
  }
`;

export const getMasterCategories = async (shopId) => {
  try {
    const variables = { filter: { shopId: Number(shopId) } };

    const response = await client.query({
      query: GET_MASTER_CATEGORIES,
      variables :{ filter: { shopId: Number(shopId) } }
    });
    return response?.data?.masterCategories ?? [];
  } catch (err) {
    console.error('Error fetching categories:', err.message || err);
    throw err;
  }
};
