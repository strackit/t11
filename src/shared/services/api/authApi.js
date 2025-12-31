/**
 * Auth API Service
 * Wrapper for authentication-related ShopsQuery calls
 */
import ShopsQuery from 'shops-query';

export const AuthAPI = {
  /**
   * Login user
   * @param {string} email 
   * @param {string} password 
   */
  login: async (email, password) => {
    return await ShopsQuery.login.loginUser(email, password);
  }
};
