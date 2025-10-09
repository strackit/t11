import { GET_ADDRESS } from '../queries/get.js';
import { mutateAddress } from '../mutations/index.js';

export async function fetchAddress(filter = {}) {
  return await GET_ADDRESS(filter);
}


export const addAddressController = async (addressData) => {
  try {
    return await mutateAddress({
      ...addressData,
      userId: Number(addressData.userId)
    });
  } catch (error) {
    console.error('Controller failed to add address:', error.message);
    throw new Error(`Failed to add address: ${error.message}`);
  }
};

export const updateAddressController = async (addressData) => {
  try {
    if (!addressData.addressId) {
      throw new Error('Address ID is required for update');
    }

    return await mutateAddress({
      ...addressData,
      userId: Number(addressData.userId),
      addressId: Number(addressData.addressId),
      update: true
    });
  } catch (error) {
    console.error('Controller failed to update address:', error.message);
    throw new Error(`Failed to update address: ${error.message}`);
  }
};

export const deleteAddressController = async ({ userId, addressId }) => {
  try {
    if (!addressId) {
      throw new Error('Address ID is required for deletion');
    }

    return await mutateAddress({
      userId: Number(userId),
      addressId: Number(addressId),
      delete: true
    });
  } catch (error) {
    console.error('Controller failed to delete address:', error.message);
    throw new Error(`Failed to delete address: ${error.message}`);
  }
};