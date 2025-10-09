import { gql } from 'graphql-tag';
import { client } from '../../../utils/apolloClient.js';

const UPDATE_BLOG_MUTATION = gql`
  mutation UpdateBlog($id: ID!, $input: blogInput!) {
    updateBlog(id: $id, input: $input) {
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

export async function UPDATE_BLOG(id, input) {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_BLOG_MUTATION,
      variables: { id, input }
    });
    return data.updateBlog;
  } catch (error) {
    console.error('Error in UPDATE_BLOG:', JSON.stringify(error, null, 2));
    throw error;
  }
}
