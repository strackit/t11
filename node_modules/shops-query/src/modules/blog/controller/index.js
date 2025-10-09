import { GET_BLOG } from '../queries/get.js';
import { UPDATE_BLOG } from '../mutations/update.js';

export async function fetchBlog(filter = {}) {
  return await GET_BLOG(filter);
}

export async function modifyBlog(id, input) {
  return await UPDATE_BLOG(id, input);
}
