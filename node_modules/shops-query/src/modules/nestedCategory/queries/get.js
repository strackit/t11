import client, { gql } from '../../../utils/apolloClient.js';

export const GET_NESTED_CATEGORY = gql`
  query GetNestedCategory($filter:  categery) {
    nestedCategory(filter: $filter) {
    id
    SecondaryCategory {
      shopId
      id
      category
    }
    Categoryname
  }
}
`;


