import client, { gql } from '../../../utils/apolloClient.js';

export const REMOVE_FROM_WISHLIST = gql`
  mutation Wishlist($userId: Int, $productId: Int, $shopId: Int, $delete: Boolean) {
    Wishlist(userId: $userId, productId: $productId, shopId: $shopId, Delete: $delete) {
      id
      userId
      productId
      shopId
    }
  }
`;

export const removeFromWishlist = async ({ userId, productId, shopId }) => {
  try {
    const { data } = await client.mutate({
      mutation: REMOVE_FROM_WISHLIST,
      variables: {
        userId: Number(userId),
        productId: Number(productId),
        shopId: Number(shopId),
        delete: true
      }
    });
    return data?.Wishlist || null;
  } catch (error) {
    console.error('Error removing from wishlist:', error.message);
    throw error;
  }
};