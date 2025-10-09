import client, { gql } from '../../../utils/apolloClient.js';

export const ADD_TO_WISHLIST = gql`
  mutation Wishlist($userId: Int, $productId: Int, $shopId: Int, $delete: Boolean) {
    Wishlist(userId: $userId, productId: $productId, shopId: $shopId, Delete: $delete) {
      userId
      productId
      shopId
      id
    }
  }
`;

export const addToWishlist = async (productId, shopId, userId) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_TO_WISHLIST,
      variables: {
        userId: Number(userId),
        productId: Number(productId),
        shopId: Number(shopId),
        delete: false
      }
    });
    return data?.Wishlist || null;
  } catch (error) {
    console.error('Error adding to wishlist:', error.message);
    throw error;
  }
};