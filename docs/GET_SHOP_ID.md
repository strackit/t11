# Get Shop ID from Custom Domain

This document describes how to retrieve the shop ID using a custom domain name.

## Overview

The application identifies which shop to load based on the domain name. This is handled through the `shops-query` package which queries the GraphQL API at `https://api.shop.strackit.com/graphql`.

## Import

```javascript
import ShopQuery from "shops-query";
```

## Function

### `ShopQuery.shop.fetchShops({ customDomain })`

Retrieves shop details based on the custom domain.

**Parameters:**
- `customDomain` (String) - The domain name to lookup (e.g., `"mystore.com"`)

**Returns:** Array of shop objects containing:
- `id` - The unique shop identifier (shopId)
- `name` - Business name
- `phone` - Contact number
- `city`, `state`, `address` - Location details
- `isOnline` - Shop online status

## Usage

```javascript
import ShopQuery from "shops-query";

// Fetch shop by custom domain
const shopData = await ShopQuery.shop.fetchShops({
  customDomain: "mystore.com"
});

// The API returns an array, take the first shop
if (shopData && shopData.length > 0) {
  const shop = shopData[0];
  const shopId = shop.id;  // Use this shopId for other API calls
  console.log("Shop ID:", shopId);
}
```

## Domain Resolution

For local development, the domain is resolved using `VITE_DOMAIN_NAME` environment variable:

```javascript
// In .env file
VITE_DOMAIN_NAME=mystore.com
```

```javascript
// Domain resolution logic
const hostname = window.location.hostname;

if (hostname === 'localhost' || hostname === '127.0.0.1') {
  return import.meta.env.VITE_DOMAIN_NAME || 'localhost';
}

return hostname; // Production: use actual domain
```

## React Context Implementation

The `ShopContext` provides shop data throughout the app:

```javascript
import { useShop } from '../context/ShopContext';

const MyComponent = () => {
  const { shopId, shopName, loading, error } = useShop();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  // Use shopId for API calls
  console.log("Current Shop ID:", shopId);
};
```

## Base URL

`https://api.shop.strackit.com/graphql`
