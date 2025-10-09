import client, { gql } from '../../../utils/apolloClient.js';

export const GET_PRODUCTS = gql`
  query GetProducts($filter: productfilter) {
  products(filter: $filter) {
    productImage {
      productId
      image
      id
    }
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
    isAddedToCart {
      inCart
    }
    id
    hsnCode
    howToUse
    featureImage
    dnp
    discount
    description
    categoryId
    category
    barcode
    addedon
  }
}
`;

export const fetchProducts = async ({ shopId = null, productId = null }) => {
  const variables = {
    filter: {}
  };

  if (productId) {
    variables.filter.productId = Number(productId);
  } else if (shopId) {
    variables.filter.shopId = Number(shopId);
  } else {
    console.error('Either shopId or productId must be provided');
    return [];
  }

  try {
    const response = await client.query({
      query: GET_PRODUCTS,
      variables,
    });

    return productId ? response?.data?.products?.[0] : response?.data?.products ?? [];
  } catch (error) {
    console.error('Failed to fetch products:', error.message || error);
    return productId ? null : [];
  }
};