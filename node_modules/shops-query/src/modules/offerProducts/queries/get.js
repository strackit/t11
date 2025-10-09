import client , {gql} from '../../../utils/apolloClient.js';

export const GET_OFFER_PRODUCTS = gql`
  query GetofferProducts($filter: offer) {
  offerProducts(filter: $filter) {
    wishList {
      like
    }
    views
    viewPrice
    tax
    specification
    shopId
    seoKeyword
    quantity {
      quantity
    }
    publish
    productImage {
      productId
      image
      id
    }
    productId
    productCategoryId
    prize
    otherInformation
    offerends
    number
    noStock
    name
    minStock
    mastercategory
    localName
    lastUpdate
    isOnline
  }
}

`;

export const fetchOfferProducts = async (shopId) => {
  if (!shopId) throw new Error('shopId is required');

  try {
    const response = await client.query({
      query: GET_OFFER_PRODUCTS,
      variables: {
        filter: {
          shopId: Number(shopId),
        },
      },
    });

    return response?.data?.offerProducts ?? [];
  } catch (error) {
    console.error(
      'Controller failed to fetch offer products:',
      error.message || error
    );
    throw error;
  }
};
