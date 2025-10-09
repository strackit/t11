import { gql } from 'graphql-tag';
import { client } from '../../../utils/apolloClient.js';

const GET_BLOGS_QUERY = gql`
  query GetBlogs($filter: blogFilter) {
    Blog(filter: $filter) {
      id
      title
      image
      description
      url
      type
      productName
      timestamp
    }
  }
`;

export async function GET_BLOG(filter = {}) {
  try {
    const { data } = await client.query({
      query: GET_BLOGS_QUERY,
      variables: { filter }
    });

    return data?.Blog;

  } catch (err) {
    console.error("Full GraphQL Error:", JSON.stringify(err, null, 2));
    throw err;
  }
}
