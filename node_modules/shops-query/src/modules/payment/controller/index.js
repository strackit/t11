import { INITIATE_PAYMENT, CHECK_PAYMENT_STATUS } from '../mutation/index.js';

export async function initiatePayment(orderId, method = 'razorpay') {
  return await INITIATE_PAYMENT(orderId, method);
}

export async function checkPaymentStatus(orderId) {
  return await CHECK_PAYMENT_STATUS(orderId);
}
