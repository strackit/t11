import client , {gql} from '../../../utils/apolloClient.js';

export const GET_SECONDARY_CATEGORIES = gql`
query SecondaryCategories($filter: categoryFilter) {
  secondaryCategories(filter: $filter) {
    id
    shopId
    mid
    category
    image
    position
    status
    addedon
    productCount
  }
}
`;

export const getSecondaryCategories = async (shopId , masterCategoryId ) => {
  try {
    const variables = {
      filter: {
        shopId: Number(shopId),
        masterCategoryId: Number(masterCategoryId),
      },
    };

    const response = await client.query({
      query: GET_SECONDARY_CATEGORIES,
      variables: { filter: { shopId: Number(shopId) , masterCategoryId: Number(masterCategoryId),} },
    });
    return response?.data?.secondaryCategories ?? [];
  } catch (err) {
    console.error('Error fetching categories:', err.message || err);
    throw err;
  }
};
