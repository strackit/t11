import client , {gql} from '../../../../utils/apolloClient.js';
import { ADD_TO_WISHLIST } from '../../mutations/add.js';

export const addToWishlistController = async (productId, shopId, userId) => {
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
    
    if (!data?.Wishlist) {
      throw new Error('Failed to add to wishlist: No data returned');
    }
    
    return data.Wishlist;
  } catch (error) {
    console.error('Controller failed to add to wishlist:', error.message);
    throw new Error(`Failed to add to wishlist: ${error.message}`);
  }
};