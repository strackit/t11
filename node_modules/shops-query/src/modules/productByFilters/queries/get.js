import client , { gql } from '../../../utils/apolloClient.js';

const GET_PRODUCTS_BY_FILTERS = gql`
  query ProductsByFilters($filters: ProductFilterInput) {
    productByFilters(filters: $filters) {
      id
      name
      size
      price
      category
    }
  }
`;

export const fetchProductsByFilters = async (filters) => {
  try {
    const response = await client.query({
      query: GET_PRODUCTS_BY_FILTERS,
      variables: { filters },
    });

    return response?.data?.productByFilters ?? [];
  } catch (error) {
    console.error('Error fetching products by filters:', error.message || error);
    throw error;
  }
};