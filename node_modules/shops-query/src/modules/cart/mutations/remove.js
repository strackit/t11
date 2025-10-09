import client, { gql } from '../../../utils/apolloClient.js';

export const UPDATE_OR_DELETE_CART = gql`
  mutation Cart(
    $userId: Int!
    $productId: Int!
    $shopId: Int!
    $quantity: Int
    $update: Boolean
    $delete: Boolean
  ) {
    Cart(
      userId: $userId
      productId: $productId
      shopId: $shopId
      quantity: $quantity
      Update: $update
      Delete: $delete
    ) {
      id
      productId
      userId
      shopId
      quantity
    }
  }
`;

export const updateCartItem = async ({ userId, productId, shopId, quantity }) => {
  try {
    const { data, errors } = await client.mutate({
      mutation: UPDATE_OR_DELETE_CART,
      variables: {
        userId: Number(userId),
        productId: Number(productId),
        shopId: Number(shopId),
        quantity: Number(quantity),
        update: true,
        delete: null
      }
    });

    if (errors) {
      throw new Error(errors.map(e => e.message).join(', '));
    }

    return data?.Cart || null;
  } catch (error) {
    console.error('Error updating cart item:', error.message);
    throw error;
  }
};

export const removeFromCart = async ({ userId, productId, shopId }) => {
  try {
    const { data, errors } = await client.mutate({
      mutation: UPDATE_OR_DELETE_CART,
      variables: {
        userId: Number(userId),
        productId: Number(productId),
        shopId: Number(shopId),
        quantity: null,
        update: null,
        delete: true
      }
    });

    if (errors) {
      throw new Error(errors.map(e => e.message).join(', '));
    }

    return data?.Cart || null;
  } catch (error) {
    console.error('Error removing from cart:', error.message);
    throw error;
  }
};
