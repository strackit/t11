import client , {gql} from '../../../utils/apolloClient.js';

const GET_CATEGORIES = gql`
 query getCategories($filter: shop) {
  categories(filter: $filter) {
    category
  }
}
`;

export const getCategories = async (shopId) => {
  const variables = {
    filter: {
      shopId : Number(shopId), 
      status:1,
    },
  };

  try {
    const res = await client.query({
    query: GET_CATEGORIES,
    variables: variables,
  });
    return res.data.categories;
  } catch (err) {
    console.error('Error in getCategories:', err.message || err);
    throw err;
  }
};
