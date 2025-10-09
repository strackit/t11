import { GET_COUPONS } from '../queries/get.js';
import { UPDATE_COUPON } from '../mutation/update.js';

export async function fetchCoupons(filter) {
  return GET_COUPONS(filter);
}

export async function updateCoupon(id, input) {
  return UPDATE_COUPON(id, input);
}
