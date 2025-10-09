import client , { gql } from '../../../utils/apolloClient.js';

export const GET_SPECIFICATIONS_BY_SHOP = gql`
  query GetSpecificationsByShop($filter: shopFilter) {
    getSpecificationsByShop(filter: $filter) {
      id
      category
      position
      SpecificationsMaster {
        name
        id
        Specification {
          value
          id
          specification_id
        }
        supportVariants
      }
    }
  }
`;

export const getSpecificationsByShop = async (shopId) => {
  try {
    const response = await client.query({
      query: GET_SPECIFICATIONS_BY_SHOP,
      variables: { filter: { shopId: Number(shopId) } }
    });
    return response?.data?.getSpecificationsByShop ?? [];
  } catch (err) {
    console.error('Error fetching specifications:', err.message);
    throw err;
  }
};