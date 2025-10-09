import client, { gql } from '../../../utils/apolloClient.js';

export const GET_CART = gql`
  query GetCart($filter: CartFilter1) {
    cart(filter: $filter) {
      id
      productId
      userId
      shopId
      quantity
      prize
      Discount
      name
      featureImage
      tax
      noStock
      minStock
      mastercategory
      hsnCode
      description
      category
    }
  }
`;

export const fetchCart = async (shopId , userId) => {
  try {
    const { data, errors } = await client.query({
      query: GET_CART,
      variables: {
        filter: {
          shopId: Number(shopId),
          userId: Number(userId),
        },
      },
      fetchPolicy: "network-only",
    });

    if (errors) {
      throw new Error(errors.map(e => e.message).join(', '));
    }

    return data?.cart || [];
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    throw error;
  }
};