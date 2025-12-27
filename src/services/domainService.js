/**
 * Domain Service
 * Resolves the domain name for shop identification.
 * - On localhost: uses VITE_DOMAIN_NAME from environment
 * - On production: uses the actual browser hostname
 */

export function getDomainName() {
  const hostname = window.location.hostname;
  
  // Check if running on localhost (with or without port)
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('localhost:')) {
    return import.meta.env.VITE_DOMAIN_NAME || 'localhost';
  }
  
  return hostname;
}
