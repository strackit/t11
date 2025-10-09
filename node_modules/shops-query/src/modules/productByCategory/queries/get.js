import client, { gql } from '../../../utils/apolloClient.js';

const PRODUCTS_BY_CATEGORY = gql`
  query ProductsByCategory($filter: CategoryWiseFilter) {
    productsByCategory(filter: $filter) {
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
      Specifications {
        specification
        value
      }
    }
  }
`;

export const fetchProductsByCategory = async (masterCategory, shopId, secondaryCategory = null) => {
  try {
    const filter = {
      master: masterCategory,
      shopId: Number(shopId)
    };

    if (secondaryCategory) {
      filter.secondary = secondaryCategory;
    }

    const { data } = await client.query({
      query: PRODUCTS_BY_CATEGORY,
      variables: { filter }
    });

    return data?.productsByCategory || [];
  } catch (error) {
    console.error('Error fetching products by category:', error.message);
    throw error;
  }
};