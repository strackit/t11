import { GET_BANNER_DATA } from '../queries/get.js';
import { UPDATE_BANNER_DATA } from '../mutations/update.js';

export const fetchBanner = async (filter) => {
  return await GET_BANNER_DATA(filter);
};

export const modifyBanner = async (id, input) => {
  return await UPDATE_BANNER_DATA(id, input);
};
