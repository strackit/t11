# shops-query Package Usage Documentation

This document provides a comprehensive reference for all usages of the `shops-query` npm package in the one-big project.

## Package Installation

```bash
npm install shops-query@git+https://github.com/strackit/shops-query.git#release/0.2
```

## Module Overview

| Module | Import Path | Purpose |
|--------|-------------|---------|
| Cart | `shops-query/src/modules/cart` | Shopping cart operations |
| Wishlist | `shops-query/src/modules/wishlist` | Wishlist management |
| Products | `shops-query/src/modules/products` | Product fetching |
| Address | `shops-query/src/modules/address` | User address management |
| Shop | `shops-query/src/modules/shop` | Shop information |
| Master Categories | `shops-query/src/modules/masterCategories` | Primary categories |
| Secondary Categories | `shops-query/src/modules/SecondaryCategories` | Subcategories |
| Order History | `shops-query/src/modules/OrderHistory` | Order retrieval |
| Banner | `shops-query/src/modules/banner` | Banner images |

---

## Cart Module

### Import Statements
```javascript
import { addToCart, fetchCart } from "shops-query/src/modules/cart";
// or
import { addToCart, fetchCart } from "shops-query/src/modules/cart/index.js";
```

### Functions

#### `fetchCart(shopId, userId)`
Retrieves the current user's cart items.

**Parameters:**
- `shopId` (Number) - The shop identifier
- `userId` (Number) - The user identifier

**Returns:** Array of cart items with properties:
- `productId` - Product ID
- `quantity` - Quantity in cart

**Usage:**
```javascript
const cartItems = await fetchCart(shopid, Number(userId));
const count = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
```

#### `addToCart(options)`
Adds a product to the user's cart.

**Parameters (Object):**
- `userId` (Number) - User ID
- `shopId` (Number) - Shop ID
- `productId` (Number) - Product ID to add
- `quantity` (Number) - Quantity to add

**Usage:**
```javascript
await addToCart({
  userId: Number(userId),
  shopId: Number(shopid),
  productId: Number(productId),
  quantity: 1,
});
```

### Files Using This Module
- `src/utils/cart.js` - Cart migration
- `src/utils/Auth.js` - Post-login cart sync
- `src/components/header/index.js` - Cart count display
- `src/components/singleproduct/index.js` - Add to cart
- `src/components/ui/AddToCartButton.js` - Reusable button

---

## Wishlist Module

### Import Statements
```javascript
// Query functions
import { fetchWishlist } from "shops-query/src/modules/wishlist/queries/get.js";

// Mutation functions
import { addToWishlist } from "shops-query/src/modules/wishlist/mutations/add.js";
import { removeFromWishlist } from "shops-query/src/modules/wishlist/mutations/remove.js";

// Controller functions (alternative)
import { 
  getWishlistController, 
  removeFromWishlistController 
} from "shops-query/src/modules/wishlist";
```

### Functions

#### `fetchWishlist(userId, shopId)`
Retrieves user's wishlist items.

**Parameters:**
- `userId` (Number) - User ID
- `shopId` (Number) - Shop ID

**Returns:** Array of wishlist items with `productId` property

**Usage:**
```javascript
const wishlistData = await fetchWishlist(userId, shopid);
const favorites = {};
wishlistData.forEach((item) => {
  favorites[item.productId] = true;
});
```

#### `addToWishlist(productId, shopId, userId)`
Adds a product to wishlist.

**Parameters:**
- `productId` (Number) - Product ID
- `shopId` (Number) - Shop ID
- `userId` (Number) - User ID

**Usage:**
```javascript
await addToWishlist(productId, shopid, userId);
```

#### `removeFromWishlist(options)`
Removes a product from wishlist.

**Parameters (Object):**
- `userId` (Number) - User ID
- `productId` (Number) - Product ID
- `shopId` (Number) - Shop ID

**Usage:**
```javascript
await removeFromWishlist({
  userId: userId,
  productId: productIdNum,
  shopId: shopid,
});
```

### Files Using This Module
- `src/components/singleproduct/index.js`
- `src/components/recommended/index.js`
- `src/components/home/newarrivals/index.js`
- `src/components/home/shopbymodel/index.js`
- `src/components/home/shopbybrand/index.js`
- `src/components/wishlist/index.js`

---

## Products Module

### Import Statements
```javascript
import { 
  getProductsController, 
  getProductByIdController 
} from "shops-query/src/modules/products";
// or
import { getProductsController } from "shops-query/src/modules/products/index.js";
```

### Functions

#### `getProductsController(filter)`
Retrieves products based on filter criteria.

**Parameters:**
- `filter` (Number | Object) - Shop ID or filter object with:
  - `shopId` (Number) - Shop ID
  - `masterCategoryId` (Number, optional) - Category filter
  - `userId` (Number, optional) - User ID

**Returns:** Array of product objects

**Usage:**
```javascript
// Simple usage with shop ID
const products = await getProductsController(shopid);

// With filter object
const filter = {
  shopId: Number(shopid),
  masterCategoryId: Number(masterCategoryId),
  userId: userid ? Number(userid) : undefined,
};
const products = await getProductsController(filter);
```

#### `getProductByIdController(productId)`
Retrieves a single product by ID.

**Parameters:**
- `productId` (Number) - Product ID

**Returns:** Product object with properties:
- `id`, `name`, `prize`, `discount`, `tax`
- `featureImage`, `images`, `productImage`
- `description`, `category`, `spec`, `Specifications`

**Usage:**
```javascript
const productData = await getProductByIdController(parseInt(productId));
```

### Files Using This Module
- `src/components/singleproduct/index.js`
- `src/components/recommended/index.js`
- `src/components/home/newarrivals/index.js`
- `src/components/home/shopbymodel/index.js`
- `src/components/home/shopbybrand/index.js`

---

## Address Module

### Import Statements
```javascript
import { 
  fetchAddress, 
  mutateAddress 
} from "shops-query/src/modules/address/index.js";
```

### Functions

#### `fetchAddress(options)`
Retrieves user's saved addresses.

**Parameters (Object):**
- `userId` (Number) - User ID

**Returns:** Array of address objects with:
- `id`, `name`, `phone`, `street`, `city`
- `state`, `country`, `pincode`, `type`, `isDefault`

**Usage:**
```javascript
const addresses = await fetchAddress({ userId: Number(userId) });
const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0];
```

#### `mutateAddress(options)`
Creates, updates, or deletes an address.

**Parameters (Object):**
- `userId` (Number) - User ID
- `name`, `phone`, `street`, `city`, `state`, `country`, `pincode`, `type` - Address fields
- `addressId` (Number, optional) - For update/delete
- `update` (Boolean, optional) - Set true for update
- `delete` (Boolean, optional) - Set true for delete

**Usage:**
```javascript
// Create new address
await mutateAddress({
  userId: Number(userId),
  name: "John Doe",
  phone: "9876543210",
  street: "123 Main St",
  city: "Chennai",
  state: "Tamil Nadu",
  country: "India",
  pincode: "600001",
  type: "Home",
});

// Update address
await mutateAddress({
  userId: Number(userId),
  addressId: addressId,
  update: true,
  ...addressData,
});

// Delete address
await mutateAddress({
  userId: Number(userId),
  addressId: addressId,
  delete: true,
});
```

### Files Using This Module
- `src/components/UserLogin/index.js` - Profile address management
- `src/components/singleproduct/index.js` - Delivery address for orders

---

## Shop Module

### Import Statements
```javascript
import shopController from "shops-query/src/modules/shop";
```

### Functions

#### `shopController.fetchShops(options)`
Retrieves shop information.

**Parameters (Object):**
- `id` (Number) - Shop ID

**Returns:** Array of shop objects with:
- `phone`, `email`, `name`
- `CMS` - Content management data (policies, etc.)

**Usage:**
```javascript
const data = await shopController.fetchShops({ id: shopid });
const shop = data?.[0];
console.log(shop.phone);
console.log(shop.CMS); // Contains policy pages
```

### Files Using This Module
- `src/components/footer/index.js` - Shop contact info and policies

---

## Master Categories Module

### Import Statements
```javascript
import { fetchMasterCategories } from "shops-query/src/modules/masterCategories";
```

### Functions

#### `fetchMasterCategories(shopId)`
Retrieves primary categories for a shop.

**Parameters:**
- `shopId` (Number) - Shop ID

**Returns:** Array of category objects with:
- `id`, `category`, `image`, `status`, `position`

**Usage:**
```javascript
const categories = await fetchMasterCategories(shopid);
const activeCategories = categories
  .filter(cat => cat.status === 1)
  .sort((a, b) => (a.position || 999) - (b.position || 999))
  .map((cat) => ({
    id: cat.id,
    name: cat.category,
    image: cat.image ? `${imagePrefix}${cat.image}` : null,
  }));
```

### Files Using This Module
- `src/components/header/index.js` - Navigation menu
- `src/components/home/shopbycategory/index.js` - Category display
- `src/components/home/shopbymodel/index.js` - Model filtering
- `src/components/home/newarrivals/index.js` - Category sections

---

## Secondary Categories Module

### Import Statements
```javascript
import { fetchSecondaryCategories } from "shops-query/src/modules/SecondaryCategories";
```

### Functions

#### `fetchSecondaryCategories(shopId, masterId)`
Retrieves subcategories for a master category.

**Parameters:**
- `shopId` (Number) - Shop ID
- `masterId` (Number) - Master category ID

**Returns:** Array of subcategory objects with `category` property

**Usage:**
```javascript
const subcategories = await fetchSecondaryCategories(shopid, masterCategory.id);
const subcatNames = subcategories.map((s) => s.category);
```

### Files Using This Module
- `src/components/header/index.js` - Mega menu subcategories

---

## Order History Module

### Import Statements
```javascript
import { fetchOrderHistory } from "shops-query/src/modules/OrderHistory/Controller/index.js";
```

### Functions

#### `fetchOrderHistory(userId, shopId)`
Retrieves user's past orders.

**Parameters:**
- `userId` (Number) - User ID
- `shopId` (Number) - Shop ID

**Returns:** Array of order objects with:
- `id`, `timestamp`, `customerAddress`, `customerMobile`
- `orderdetails` - Array of order items with `price`, `quantity`, `tax`, `status`, `Products`

**Usage:**
```javascript
const orders = await fetchOrderHistory(Number(userId), Number(shopid));
orders.forEach(order => {
  const total = order.orderdetails.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const itemTax = (itemTotal * item.tax) / 100;
    return sum + itemTotal + itemTax;
  }, 0);
});
```

### Files Using This Module
- `src/components/orders/index.js` - Orders page

---

## Banner Module

### Import Statements
```javascript
import BannerApi from "shops-query/src/modules/banner/index.js";
```

### Functions

#### `BannerApi.fetchBanner(options)`
Retrieves banner images for the shop.

**Parameters (Object):**
- `shopId` (Number) - Shop ID

**Returns:** Array of banner objects with:
- `title`, `description`, `image`

**Usage:**
```javascript
BannerApi.fetchBanner({ shopId: shopid })
  .then((data) => {
    if (!data || data.length === 0) {
      setBanners([fallbackImage]);
      return;
    }
    setBanners(data);
  })
  .catch((err) => {
    console.error("Error fetching banners:", err);
    setBanners([fallbackImage]);
  });
```

### Files Using This Module
- `src/components/home/banner/index.js` - Homepage banner slider

---

## Common Patterns

### Error Handling
Always wrap API calls in try-catch blocks:

```javascript
try {
  const data = await fetchCart(shopid, userId);
  // Handle success
} catch (error) {
  console.error("Error:", error);
  showToast("Failed to load data", "error");
}
```

### Image URL Construction
Product images require prefix:

```javascript
import { imagePrefix } from "../../utils/url";

const imageUrl = product.featureImage 
  ? `${imagePrefix}${product.featureImage}` 
  : "/placeholder.jpg";
```

### User Authentication Check
Always verify user is logged in before user-specific operations:

```javascript
const userId = getUserId();
if (!userId) {
  showToast("Please login first", "error");
  return;
}
```

---

## Files Summary

| File | Modules Used |
|------|--------------|
| `src/utils/cart.js` | cart |
| `src/utils/Auth.js` | cart |
| `src/components/header/index.js` | cart, masterCategories, SecondaryCategories |
| `src/components/footer/index.js` | shop |
| `src/components/singleproduct/index.js` | cart, wishlist, products, address |
| `src/components/recommended/index.js` | products, wishlist |
| `src/components/wishlist/index.js` | wishlist |
| `src/components/orders/index.js` | OrderHistory |
| `src/components/UserLogin/index.js` | address |
| `src/components/ui/AddToCartButton.js` | cart |
| `src/components/home/banner/index.js` | banner |
| `src/components/home/newarrivals/index.js` | products, masterCategories, wishlist |
| `src/components/home/shopbycategory/index.js` | masterCategories |
| `src/components/home/shopbymodel/index.js` | products, masterCategories, wishlist |
| `src/components/home/shopbybrand/index.js` | products, wishlist |
