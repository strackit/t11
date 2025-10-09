import { GET_SHOP_LIST } from '../queries/get.js';
import { UPDATE_SHOP_DETAILS } from '../mutation/update.js';

export async function fetchShops(filter) {
  return GET_SHOP_LIST(filter);
}
export async function updateShop(id, input) {
  return UPDATE_SHOP_DETAILS(id, input);
}
