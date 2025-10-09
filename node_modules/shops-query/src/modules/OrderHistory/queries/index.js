import client ,  { gql } from '../../../utils/apolloClient.js';

export const GET_ORDER_HISTORY = gql`
  query OrderHistory($filter: orders) {
    orderHistory(filter: $filter) {
      id
      voucherNo
      shopId
      orderType
      customerId
      customerName
      customerMobile
      customerAddress
      customerGstin
      userOrder
      pickuptime
      rating
      feedback
      paymentInfo
      timestamp
      orderdetails {
        id
        masterId
        stockId
        quantity
        tax
        dnp
        discount
        price
        totalPrice
        status
        returned
        Products {
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
        }
      }
    }
  }
`;

export const getOrderHistory = async (userId, shopId) => {
  try {
    const response = await client.query({
      query: GET_ORDER_HISTORY,
      variables: { filter: { userId: Number(userId), shopId: Number(shopId) } }
    });
    return response?.data?.orderHistory ?? [];
  } catch (err) {
    console.error('Error fetching order history:', err.message);
    throw err;
  }
};