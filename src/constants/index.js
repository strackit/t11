/**
 * Application Constants
 * Common values used across multiple components
 */

// S3 bucket URL prefix for product images
export const S3_IMAGE_PREFIX = 'https://s3.ap-south-1.amazonaws.com/business.strackit.com/';

/**
 * Get full image URL by appending the S3 prefix
 * @param {string} imagePath - Relative image path from API
 * @returns {string} Full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath; // Already a full URL
  return `${S3_IMAGE_PREFIX}${imagePath}`;
};
