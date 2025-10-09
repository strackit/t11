import { addToCart } from '../mutations/add.js';
import { updateCartItem, removeFromCart } from '../mutations/remove.js';
import { fetchCart } from '../queries/get.js';

export const addToCartController = async ({ productId, shopId, userId, quantity = 1 }) => {
  try {
    // First attempt to add to cart
    let result;
    try {
      result = await addToCart({ productId, shopId, userId, quantity });
      if (result) {
        return result;
      }
    } catch (addError) {
      console.warn('Initial add failed, trying update:', addError.message);
    }

    // If add fails or returns null, try updating quantity
    result = await updateCartItem({ userId, productId, shopId, quantity });
    
    // Verify the item was actually added/updated
    const cartItems = await fetchCart(shopId, userId);
    const itemInCart = cartItems.find(item => 
      item.productId === productId && item.shopId === shopId
    );

    if (!itemInCart) {
      throw new Error('Failed to verify item in cart after add operation');
    }

    return result || itemInCart;

  } catch (error) {
    console.error('Controller failed to add to cart:', error.message);
    throw new Error(`Failed to add to cart: ${error.message}`);
  }
};

export const fetchCartController = async (shopId, userId) => {
  try {
    const cartItems = await fetchCart(shopId, userId);
    
    if (!Array.isArray(cartItems)) {
      console.warn('Unexpected cart data format:', cartItems);
      return [];
    }
    
    return cartItems;
  } catch (error) {
    console.error('Controller failed to fetch cart:', error.message);
    throw error;
  }
};

export const removeFromCartController = async ({ userId, productId, shopId }) => {
  try {
    const result = await removeFromCart({ userId, productId, shopId });
    
    // Verify the item was actually removed
    const cartItems = await fetchCart(shopId, userId);
    const itemStillInCart = cartItems.some(item => 
      item.productId === productId && item.shopId === shopId
    );

    if (itemStillInCart) {
      throw new Error('Item still exists in cart after removal attempt');
    }

    return result;

  } catch (error) {
    console.error('Controller failed to remove from cart:', error.message);
    throw error;
  }
};

export const updateCartQuantityController = async ({ userId, productId, shopId, quantity }) => {
  try {
    const result = await updateCartItem({ userId, productId, shopId, quantity });
    
    // Verify the quantity was actually updated
    const cartItems = await fetchCart(shopId, userId);
    const item = cartItems.find(i => 
      i.productId === productId && i.shopId === shopId
    );

    if (!item) {
      throw new Error('Item not found in cart after update attempt');
    }

    if (item.quantity !== quantity) {
      throw new Error(`Quantity not updated (expected ${quantity}, got ${item.quantity})`);
    }

    return result || item;

  } catch (error) {
    console.error('Controller failed to update cart quantity:', error.message);
    throw error;
  }
};