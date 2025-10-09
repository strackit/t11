import { GET_IPADDRESS } from '../queries/get.js';

export async function fetchIpAddress() {
  return await GET_IPADDRESS();
}
