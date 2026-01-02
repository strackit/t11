/**
 * Order API Service
 * Wrapper for order-related ShopsQuery calls
 */
import ShopsQuery from 'shops-query';

// Log available modules for debugging
console.log('ShopsQuery available modules:', Object.keys(ShopsQuery || {}));
console.log('ShopsQuery.orderByCart:', ShopsQuery?.orderByCart);
console.log('ShopsQuery.orders:', ShopsQuery?.orders);

export const OrderAPI = {
  /**
   * Place an order from the user's cart
   * @param {object} params - Order parameters
   * @param {number} params.userId - The user's ID
   * @param {number} params.shopId - The shop's ID
   * @param {string} params.orderType - "online" or "cod"
   * @param {string} params.customerName - Customer name
   * @param {string} params.customerMobile - Customer phone
   * @param {string} params.customerAddress - Full delivery address
   * @param {string} params.voucherNo - Coupon code (use "1" if no coupon)
   * @param {number} params.billingAddress - Billing address ID
   * @param {number} params.shippingAddress - Shipping address ID
   * @param {string} params.shopPhone - Shop contact number (optional)
   * @returns {Promise<Array>} Order response with order ID
   */
  placeOrder: async ({
    userId,
    shopId,
    orderType = 'cod',
    customerName,
    customerMobile,
    customerAddress,
    voucherNo = '1',
    billingAddress = 0,
    shippingAddress = 0,
    shopPhone = ''
  }) => {
    const orderVariables = {
      userId: Number(userId),
      shopId: Number(shopId),
      voucherNo,
      orderType,
      customerId: Number(userId),
      customerName,
      customerMobile,
      customerAddress,
      pickuptime: new Date().toISOString(),
      feedback: '',
      rating: 5,
      shopPhone,
      billingAddress: Number(billingAddress),
      shippingAddress: Number(shippingAddress)
    };

    console.log('OrderAPI.placeOrder: orderVariables:', orderVariables);
    
    // Try different possible module names
    if (ShopsQuery.orderByCart?.placeOrderByCart) {
      console.log('Using ShopsQuery.orderByCart.placeOrderByCart');
      return await ShopsQuery.orderByCart.placeOrderByCart(orderVariables);
    } else if (ShopsQuery.orderbycart?.placeOrderByCart) {
      console.log('Using ShopsQuery.orderbycart.placeOrderByCart');
      return await ShopsQuery.orderbycart.placeOrderByCart(orderVariables);
    } else if (ShopsQuery.orders?.placeOrder) {
      console.log('Using ShopsQuery.orders.placeOrder');
      return await ShopsQuery.orders.placeOrder(orderVariables);
    } else {
      console.error('No order placement module found in ShopsQuery');
      console.log('Available modules:', Object.keys(ShopsQuery || {}));
      throw new Error('Order placement API not available');
    }
  }
};

