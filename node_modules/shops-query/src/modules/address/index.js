import { fetchAddress } from "./queries/get.js";
import {
  addAddressController as addAddress,
  updateAddressController as updateAddress,
  deleteAddressController as deleteAddress,
  mutateAddress
} from './mutations/index.js';

export { 
  fetchAddress, 
  addAddress, 
  updateAddress, 
  deleteAddress,
  mutateAddress 
};