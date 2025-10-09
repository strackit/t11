import client, { gql } from '../../../utils/apolloClient.js';

const SEARCH_PRODUCTS = gql`
  query SearchProducts($filter: searchfilter) {
    searchProducts(filter: $filter) {
      id
      number
      name
      localName
      hsnCode
      tax
      prize
      dnp
      noStock
      minStock
      description
      seoKeyword
      howToUse
      otherInformation
      shopId
      featureImage
      mastercategory
      category
      categoryId
      publish
      viewPrice
      discount
      offerends
      views
      isOnline
      productId
      productCategoryId
      barcode
      lastUpdate
      addedon
      wishList {
        like
      }
      isAddedToCart {
        inCart
      }
      quantity {
        quantity
      }
      specification
      productImage {
        id
        image
        productId
      }
    }
  }
`;

export const searchProducts = async (keyword, shopId = 512) => {
  try {
    const { data } = await client.query({
      query: SEARCH_PRODUCTS,
      variables: {
        filter: {
          shopId: Number(shopId),
          keyWord: keyword
        }
      },
    });
    return data?.searchProducts || [];
  } catch (error) {
    console.error('Error searching products:', error.message);
    throw error;
  }
};