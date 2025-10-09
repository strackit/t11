import client , {gql} from '../../../../utils/apolloClient.js';
import { REMOVE_FROM_WISHLIST } from '../../mutations/remove.js';

export const removeFromWishlistController = async ({ userId, productId, shopId }) => {
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

    if (!data?.Wishlist) {
      throw new Error('Failed to remove from wishlist: No data returned');
    }

    return data.Wishlist;
  } catch (error) {
    console.error('Error removing from wishlist:', error.message);
    throw new Error(`Failed to remove from wishlist: ${error.message}`);
  }
};