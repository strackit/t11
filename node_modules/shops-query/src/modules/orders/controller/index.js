import { GET_ORDERS } from '../queries/get.js';
import { UPDATE_ORDER } from '../mutation/update.js';

export async function fetchOrders(filter) {
  return await GET_ORDERS(filter);
}


export async function modifyOrder(id, input) {
  return await UPDATE_ORDER(id, input);
}
