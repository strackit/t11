# Push to Cart - Server API

This document describes the server cart API using the `shops-query` package.

## Import

```javascript
import ShopsQuery from "shops-query";
```

## Authentication

The `user_id` must be retrieved from the decoded JWT `auth_token` in the `ualum` cookie:

```javascript
// Decode JWT to extract user_id
const decodeJwt = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
};

// Get user_id from auth_token
const getUserIdFromToken = (user) => {
  if (!user || !user.auth_token) return null;
  const decoded = decodeJwt(user.auth_token);
  return decoded?.user_id || null;
};
```

## API Functions

### `ShopsQuery.cart.addToCart({ productId, shopId, userId, quantity })`

Adds a product to the server cart.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `productId` | String | Product ID to add |
| `shopId` | String | Shop ID |
| `userId` | String | User ID (from decoded JWT) |
| `quantity` | Number | Quantity to add |

**Usage:**
```javascript
await ShopsQuery.cart.addToCart({
  productId: "product_123",
  shopId: shopId,
  userId: userId,  // Decoded from JWT
  quantity: 1
});
```

---

### `ShopsQuery.cart.fetchCart({ userId, shopId })`

Fetches the user's cart from the server.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | String | User ID (from decoded JWT) |
| `shopId` | String | Shop ID |

**Returns:** Array of cart items

**Usage:**
```javascript
const serverCart = await ShopsQuery.cart.fetchCart({
  userId: userId,  // Decoded from JWT
  shopId: shopId
});
```

## Base URL

`https://api.shop.strackit.com/graphql`
