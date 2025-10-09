import { gql } from 'graphql-tag';
import  client  from '../../../utils/apolloClient.js';

const UPDATE_BANNER = gql`
  mutation UpdateBanner($id: Int!, $input: bannerFilterInput!) {
    updateBanner(id: $id, input: $input) {
      id
      title
      image
      link
      priority
      addedon
    }
  }
`;

export const UPDATE_BANNER_DATA = async (id, input) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_BANNER,
      variables: { id, input }
    });
    return data?.updateBanner;
  } catch (err) {
    console.error("Error in UPDATE_BANNER:", err);
    throw err;
  }
};
