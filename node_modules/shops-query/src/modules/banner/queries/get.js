import { gql } from 'graphql-tag';
import  client  from '../../../utils/apolloClient.js';

export const GET_BANNERS = gql`
  query GetBanners($filter: bannerFilterInput) {
    banners(filter: $filter) {
      id
      title
      image
      priority
      addedon
      link
    }
  }
`;

export const GET_BANNER_DATA = async (filter) => {
  try {
    const { data } = await client.query({
      query: GET_BANNERS,
      variables: { filter }
    });
    return data?.banners;
  } catch (error) {
    console.error("Error in GET_BANNERS:", error);
    throw error;
  }
};
