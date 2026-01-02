/**
 * Address API Service
 * Wrapper for address-related ShopsQuery calls
 */
import ShopsQuery from 'shops-query';

export const AddressAPI = {
  /**
   * Fetch all addresses for a user
   * @param {number} userId - The user's ID
   * @returns {Promise<Array>} Array of address objects
   */
  fetchAddresses: async (userId) => {
    return await ShopsQuery.address.fetchAddress({ userId: Number(userId) });
  },

  /**
   * Save a new address or update existing
   * @param {object} params - Address parameters
   * @param {number} params.userId - The user's ID
   * @param {string} params.name - Recipient name
   * @param {string} params.phone - Contact number
   * @param {string} params.street - Street address
   * @param {string} params.city - City name
   * @param {string} params.state - State name
   * @param {string} params.pincode - Postal code
   * @param {number} params.id - Address ID for updates (optional)
   * @returns {Promise<Object>} Success status
   */
  saveAddress: async ({ userId, name, phone, street, city, state, pincode, id }) => {
    const addressData = {
      userId: Number(userId),
      name,
      phone,
      street,
      city,
      state,
      pincode
    };

    if (id) {
      addressData.id = Number(id);
    }

    return await ShopsQuery.address.mutateAddress(addressData);
  }
};
