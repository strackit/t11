import client, { gql } from '../../../utils/apolloClient.js';

export const ADD_TO_CART = gql`
  mutation Cart(
    $userId: Int!
    $productId: Int!
    $shopId: Int!
    $quantity: Int!
  ) {
    Cart(
      userId: $userId
      productId: $productId
      shopId: $shopId
      quantity: $quantity
    ) {
      id
      productId
      userId
      shopId
      quantity
    }
  }
`;

export const addToCart = async ({ productId, shopId, userId, quantity = 1 }) => {
  try {
    const { data, errors } = await client.mutate({
      mutation: ADD_TO_CART,
      variables: {
        userId: Number(userId),
        productId: Number(productId),
        shopId: Number(shopId),
        quantity: Number(quantity)
      }
    });

    if (errors) {
      throw new Error(errors.map(e => e.message).join(', '));
    }

    if (!data?.Cart) {
      throw new Error('No data returned from add to cart mutation');
    }

    return data.Cart;
  } catch (error) {
    console.error('Error adding to cart:', error.message);
    throw error;
  }
};
