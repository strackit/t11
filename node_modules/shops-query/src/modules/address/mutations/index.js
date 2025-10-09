import client, { gql } from '../../../utils/apolloClient.js';

export const ADDRESS_MUTATION = gql`
  mutation AddressMutation(
    $addressId: Int
    $userId: Int!
    $type: String
    $country: String
    $state: String
    $city: String
    $street: String
    $phone: String
    $pincode: String
    $name: String
    $delete: Boolean
    $update: Boolean
  ) {
    Address(
      id: $addressId
      userId: $userId
      type: $type
      country: $country
      state: $state
      city: $city
      street: $street
      phone: $phone
      pincode: $pincode
      name: $name
      Delete: $delete
      Update: $update
    ) {
      id
      userId
      type
      country
      state
      city
      street
      pincode
      phone
      name
      status
    }
  }
`;

export const mutateAddress = async ({
  userId,
  addressId = null,
  type = 'Home',
  country = 'India',
  state,
  city,
  street,
  phone,
  pincode,
  name,
  delete: deleteFlag = false,
  update = false
}) => {
  try {
    const { data, errors } = await client.mutate({
      mutation: ADDRESS_MUTATION,
      variables: {
        userId: Number(userId),
        addressId: addressId ? Number(addressId) : null,
        type,
        country,
        state,
        city,
        street,
        phone,
        pincode,
        name,
        delete: deleteFlag,
        update
      },
      fetchPolicy: 'no-cache'
    });

    if (errors) {
      throw new Error(errors.map(e => e.message).join(', '));
    }

    if (!data?.Address) {
      throw new Error('No data returned from address mutation');
    }

    return data.Address;
  } catch (error) {
    console.error('Error in address mutation:', error.message);
    throw new Error(`Address operation failed: ${error.message}`);
  }
};

export const addAddressController = async (addressData) => {
  try {
    // Validate required fields
    if (!addressData.userId || !addressData.street || !addressData.city || !addressData.phone) {
      throw new Error('Missing required address fields');
    }

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