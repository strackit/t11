# Shops-Query API Documentation

**Package Version:** `release/0.3`  
**Package URL:** `git+https://github.com/strackit/shops-query.git#release/0.3`

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Import Pattern](#import-pattern)
4. [Module Overview](#module-overview)
5. [API Reference](#api-reference)
   - [Address Module](#address-module)
   - [Banner Module](#banner-module)
   - [Blog Module](#blog-module)
   - [Cart Module](#cart-module)
   - [Categories Module](#categories-module)
   - [Coupon Code Module](#coupon-code-module)
   - [Customer Message Module](#customer-message-module)
   - [Filter Master Module](#filter-master-module)
   - [Forgot Password Module](#forgot-password-module)
   - [Login Module](#login-module)
   - [Master Categories Module](#master-categories-module)
   - [Nested Category Module](#nested-category-module)
   - [Offer Products Module](#offer-products-module)
   - [Order by Cart Module](#order-by-cart-module)
   - [Order History Module](#order-history-module)
   - [Orders Module](#orders-module)
   - [OTP Based Auth Module](#otp-based-auth-module)
   - [Payment Module](#payment-module)
   - [Payment Link Module](#payment-link-module)
   - [Product by Category Module](#product-by-category-module)
   - [Product by Price Module](#product-by-price-module)
   - [Product by Specification Module](#product-by-specification-module)
   - [Product Reviews Module](#product-reviews-module)
   - [Products Module](#products-module)
   - [Promotion Module](#promotion-module)
   - [Ratings Module](#ratings-module)
   - [Register User Module](#register-user-module)
   - [Search Filter Module](#search-filter-module)
   - [Search Products Module](#search-products-module)
   - [Secondary Categories Module](#secondary-categories-module)
   - [Shipping Cost Module](#shipping-cost-module)
   - [Shop Module](#shop-module)
   - [Specifications Module](#specifications-module)
   - [State Module](#state-module)
   - [Top Products Module](#top-products-module)
   - [User Order Details Module](#user-order-details-module)
   - [Wishlist Module](#wishlist-module)

---

## Introduction

The `shops-query` package is a comprehensive GraphQL-based API client library designed for e-commerce applications. It provides a collection of modules to interact with various shop functionalities including product management, cart operations, user authentication, order processing, and more.

---

## Installation

Add the package to your `package.json`:

```json
{
  "dependencies": {
    "shops-query": "git+https://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@github.com/strackit/shops-query.git#release/0.3"
  }
}
```

Then run:

```bash
npm install
```

---

## Authentication

The `userId` must be retrieved from the decoded JWT `auth_token` stored in the `ualum` cookie. This cookie can contain either a JSON-encoded string or a direct token.

### Helper Functions

Include these robust helper functions in your project (`src/utils/helpers.js`) to handle authentication:

```javascript
// Get a cookie by name
export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

// Decode JWT to extract user_id
export const decodeJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        return null;
    }
};

// Get the actual userId from the 'ualum' cookie
export const getUserId = () => {
    try {
        const cookieValue = getCookie("ualum");
        if (cookieValue) {
            let token = cookieValue;
            try {
                // Try parsing as JSON first (some systems store object)
                const decodedValue = JSON.parse(decodeURIComponent(cookieValue));
                token = decodedValue.auth || decodedValue.auth_token || token;
            } catch (e) {
                // Not JSON, use raw cookie value
            }
            const decodedAuth = decodeJwt(token);
            // Result can be in various fields depending on API version
            return parseInt(decodedAuth.user_id || decodedAuth.userId || decodedAuth.id);
        }
        return null;
    } catch (error) {
        return null;
    }
};
```


## Import Pattern

The `shops-query` package uses a **default export pattern**. All modules are accessible through a single `ShopQuery` object.

### Basic Import

```javascript
import ShopQuery from 'shops-query';
```

### Usage Pattern

Access any module's functions through the `ShopQuery` object:

```javascript
// Address module
const addresses = await ShopQuery.address.fetchAddress({ userId: 123 });

// Cart module
await ShopQuery.cart.addToCart({ userId: 123, productId: 101, shopId: 1 });

// Products module
const product = await ShopQuery.products.getProductByproductIdController(productId, shopId);
```

**Note:** All examples in this documentation use this default import pattern.

---

## Module Overview

The package is organized into the following modules accessible via `ShopQuery`:

- **ShopQuery.address** - Manage user addresses
- **ShopQuery.banner** - Fetch promotional banners
- **ShopQuery.blog** - Blog posts and content
- **ShopQuery.cart** - Shopping cart operations
- **ShopQuery.couponCode** - Discount coupons
- **ShopQuery.customerMessage** - Customer inquiries and messages
- **ShopQuery.filterMaster** - Product filtering
- **ShopQuery.forgotPassword** - Password reset functionality
- **ShopQuery.login** - Email/password authentication
- **ShopQuery.mastercategories** - Top-level categories (lowercase in actual implementation)
- **ShopQuery.nestedCategory** - Hierarchical category structure
- **ShopQuery.offerproducts** - Special offers (lowercase in actual implementation)
- **ShopQuery.orderByCart** - Place orders
- **ShopQuery.orderHistory** - View past orders
- **ShopQuery.orders** - Order management
- **ShopQuery.otpAuth** - OTP-based authentication
- **ShopQuery.payment** - Payment processing
- **ShopQuery.paymentLink** - Generate payment links
- **ShopQuery.productbycategory** - Products filtered by category (lowercase in actual implementation)
- **ShopQuery.productByPrice** - Products filtered by price
- **ShopQuery.productBySpecification** - Filter products by specs
- **ShopQuery.productReviews** - Product reviews and ratings
- **ShopQuery.products** - Product management
- **ShopQuery.promotion** - Promotional campaigns
- **ShopQuery.ratings** - Product ratings
- **ShopQuery.registerUser** - User registration
- **ShopQuery.searchFilter** - Search filter options
- **ShopQuery.searchProducts** - Product search
- **ShopQuery.secondaryCategories** - Sub-categories
- **ShopQuery.shippingCost** - Delivery charges
- **ShopQuery.shop** - Shop information
- **ShopQuery.specifications** - Product specifications
- **ShopQuery.state** - Geographic states
- **ShopQuery.topproducts** - Featured products (lowercase in actual implementation)
- **ShopQuery.userOrderDetails** - Detailed order information
- **ShopQuery.wishlist** - User wishlists

---

## API Reference

### Address Module

Access via: `ShopQuery.address`

#### fetchAddress

Retrieves all addresses for a user.

## Function

### `ShopQuery.address.fetchAddress({ userId })`

**Parameters:**
- `userId` (Number) - The user's ID

**Returns:** Array of address objects

**Sample Response:**
```javascript
[
  {
    id: 1,
    name: "John Doe",
    phone: "9876543210",
    street: "123 Main St",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getAddresses = async () => {
  try {
    const userId = 123;
    const addresses = await ShopQuery.address.fetchAddress({ userId: Number(userId) });
    console.log('User addresses:', addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
  }
};
```

#### mutateAddress

Creates or updates a user address.

## Function

### `ShopQuery.address.mutateAddress({ userId, name, phone, street, city, state, pincode, id? })`

**Parameters:**
- `userId` (Number) - The user's ID
- `name` (String) - Recipient name
- `phone` (String) - Contact number
- `street` (String) - Street address
- `city` (String) - City name
- `state` (String) - State name
- `pincode` (String) - Postal code
- `id` (Number, optional) - Address ID for updates

**Returns:** Success status

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const addNewAddress = async () => {
  try {
    const result = await ShopQuery.address.mutateAddress({
      userId: 123,
      name: "John Doe",
      phone: "9876543210",
      street: "123 Main St",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001"
    });
    console.log('Address saved:', result);
  } catch (error) {
    console.error('Error saving address:', error);
  }
};
```

---

### Banner Module

Access via: `ShopQuery.banner`

#### fetchBanner

Retrieves promotional banners for a shop.

## Function

### `ShopQuery.banner.fetchBanner({ shopId })`

**Parameters:**
- `shopId` (Number) - The shop's ID

**Returns:** Array of banner objects

**Sample Response:**
```javascript
[
  {
    id: 1,
    image: "/uploads/banner1.jpg",
    title: "Summer Sale",
    status: 1
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getBanners = async () => {
  try {
    const shopId = 1;
    const banners = await ShopQuery.banner.fetchBanner({ shopId });
    
    if (banners.length > 0) {
      console.log('Banners:', banners);
    } else {
      console.log('No banners available');
    }
  } catch (error) {
    console.error('Error fetching banners:', error);
  }
};
```

---

### Cart Module

Access via: `ShopQuery.cart`

#### fetchCart

Retrieves the user's shopping cart.

## Function

### `ShopQuery.cart.fetchCart(shopId, userId)`

**Parameters:**
- `shopId` (Number) - The shop's ID
- `userId` (Number) - The user's ID

**Returns:** Array of cart items

**Sample Response:**
```javascript
[
  {
    id: 1,
    productId: 101,
    name: "Product Name",
    prize: 999,
    Discount: 100,
    quantity: 2,
    featureImage: "/uploads/product.jpg",
    Specifications: [
      { specification: "Size", value: "M" }
    ]
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getCart = async () => {
  try {
    const shopId = 1;
    const userId = 123;
    const cartItems = await ShopQuery.cart.fetchCart(shopId, userId);
    
    console.log('Cart items:', cartItems);
    console.log('Total items:', cartItems.length);
  } catch (error) {
    console.error('Error fetching cart:', error);
  }
};
```

#### addToCart

Adds a product to the cart.

## Function

### `ShopQuery.cart.addToCart({ userId, productId, shopId, quantity? })`

**Parameters:**
- `userId` (Number) - The user's ID
- `productId` (Number) - The product's ID
- `shopId` (Number) - The shop's ID
- `quantity` (Number, optional) - Quantity to add (default: 1)

**Returns:** Success status

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const addProductToCart = async () => {
  try {
    const result = await ShopQuery.cart.addToCart({
      userId: 123,
      productId: 101,
      shopId: 1,
      quantity: 2
    });
    console.log('Product added to cart:', result);
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};
```

#### removeFromCart

Removes a product from the cart.

## Function

### `ShopQuery.cart.removeFromCart({ userId, productId, shopId })`

**Parameters:**
- `userId` (Number) - The user's ID
- `productId` (Number) - The product's ID
- `shopId` (Number) - The shop's ID

**Returns:** Success status

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const removeProduct = async () => {
  try {
    await ShopQuery.cart.removeFromCart({
      userId: 123,
      productId: 101,
      shopId: 1
    });
    console.log('Product removed from cart');
  } catch (error) {
    console.error('Error removing from cart:', error);
  }
};
```

#### updateCartQuantity

Updates the quantity of a cart item.

## Function

### `ShopQuery.cart.updateCartQuantity({ userId, productId, shopId, quantity })`

**Parameters:**
- `userId` (Number) - The user's ID
- `productId` (Number) - The product's ID
- `shopId` (Number) - The shop's ID
- `quantity` (Number) - New quantity

**Returns:** Success status

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const updateQuantity = async () => {
  try {
    await ShopQuery.cart.updateCartQuantity({
      userId: 123,
      productId: 101,
      shopId: 1,
      quantity: 5
    });
    console.log('Cart quantity updated');
  } catch (error) {
    console.error('Error updating quantity:', error);
  }
};
```

---

### Coupon Code Module

Access via: `ShopQuery.couponCode`

#### fetchCouponCode

Retrieves available coupon codes for a shop.

## Function

### `ShopQuery.couponCode.fetchCouponCode(shopId)`

**Parameters:**
- `shopId` (Number) - The shop's ID

**Returns:** Array of coupon objects

**Sample Response:**
```javascript
[
  {
    id: 1,
    code: "SAVE20",
    discount: 200,
    status: 1,
    minAmount: 1000,
    maxDiscount: 500
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getCoupons = async () => {
  try {
    const shopId = 1;
    const coupons = await ShopQuery.couponCode.fetchCouponCode(shopId);
    
    // Find valid coupon
    const validCoupon = coupons.find(c => c.code === "SAVE20" && c.status === 1);
    
    if (validCoupon) {
      console.log('Coupon discount:', validCoupon.discount);
    }
  } catch (error) {
    console.error('Error fetching coupons:', error);
  }
};
```

---

### Filter Master Module

Access via: `ShopQuery.filterMaster`

#### getFilterMasterByShop

Retrieves available product filters for a shop or category.

## Function

### `ShopQuery.filterMaster.getFilterMasterByShop({ shopId, categoryName?, masterCategoryName? })`

**Parameters:**
- `shopId` (Number) - The shop's ID
- `categoryName` (String, optional) - Category name to filter by
- `masterCategoryName` (String, optional) - Master category name

**Returns:** Array of filter specifications

**Sample Response:**
```javascript
[
  {
    specificationMaster: "Color",
    specificationValue: "Red"
  },
  {
    specificationMaster: "Size",
    specificationValue: "M"
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getFilters = async () => {
  try {
    const filters = await ShopQuery.filterMaster.getFilterMasterByShop({
      shopId: 1,
      categoryName: "T-shirts",
      masterCategoryName: "Clothing"
    });
    
    // Group filters by specification master
    const groupedFilters = {};
    filters.forEach(item => {
      if (!groupedFilters[item.specificationMaster]) {
        groupedFilters[item.specificationMaster] = [];
      }
      groupedFilters[item.specificationMaster].push(item.specificationValue);
    });
    
    console.log('Available filters:', groupedFilters);
  } catch (error) {
    console.error('Error fetching filters:', error);
  }
};
```

---

### Master Categories Module

Access via: `ShopQuery.mastercategories`

#### fetchMasterCategories

Retrieves top-level categories for a shop.

## Function

### `ShopQuery.mastercategories.fetchMasterCategories(shopId)`

**Parameters:**
- `shopId` (Number) - The shop's ID

**Returns:** Array of master category objects

**Sample Response:**
```javascript
[
  {
    id: 1,
    category: "Clothing",
    name: "Clothing",
    image: "/uploads/category1.jpg",
    position: 1
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getMasterCategories = async () => {
  try {
    const shopId = 1;
    const categories = await ShopQuery.mastercategories.fetchMasterCategories(shopId);
    
    console.log('Master categories:', categories);
    
    // Find specific category
    const clothingCategory = categories.find(c => 
      c.category.toLowerCase() === 'clothing'
    );
    
    if (clothingCategory) {
      console.log('Clothing category ID:', clothingCategory.id);
    }
  } catch (error) {
    console.error('Error fetching master categories:', error);
  }
};
```

---

### Offer Products Module

Access via: `ShopQuery.offerproducts`

#### getOfferProductsController

Retrieves products with special offers.

## Function

### `ShopQuery.offerproducts.getOfferProductsController(shopId)`

**Parameters:**
- `shopId` (Number) - The shop's ID

**Returns:** Array of product objects with offers

**Sample Response:**
```javascript
[
  {
    id: 101,
    name: "Special Offer Product",
    prize: 799,
    discount: 200,
    featureImage: "/uploads/product.jpg"
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getOfferProducts = async () => {
  try {
    const shopId = 1;
    const offerProducts = await ShopQuery.offerproducts.getOfferProductsController(shopId);
    
    console.log('Products on offer:', offerProducts);
    console.log('Total offers:', offerProducts.length);
  } catch (error) {
    console.error('Error fetching offer products:', error);
  }
};
```

---

### Order by Cart Module

Access via: `ShopQuery.orderByCart`

#### placeOrderByCart

Places an order from the user's cart.

## Function

### `ShopQuery.orderByCart.placeOrderByCart({ userId, shopId, voucherNo, orderType, customerId, customerName, customerMobile, customerAddress, pickuptime, feedback, rating, shopPhone, billingAddress, shippingAddress })`

**Parameters:**
- `userId` (Number) - The user's ID
- `shopId` (Number) - The shop's ID
- `voucherNo` (String) - Coupon code (use "1" if no coupon)
- `orderType` (String) - "online" or "cod"
- `customerId` (Number) - Customer ID
- `customerName` (String) - Customer name
- `customerMobile` (String) - Customer phone
- `customerAddress` (String) - Delivery address
- `pickuptime` (String) - ISO timestamp
- `feedback` (String) - Order feedback (optional)
- `rating` (Number) - Order rating (1-5)
- `shopPhone` (String) - Shop contact number
- `billingAddress` (Number) - Billing address ID
- `shippingAddress` (Number) - Shipping address ID

**Returns:** Order object with ID

**Sample Response:**
```javascript
[
  {
    id: 1001,
    orderId: "ORD-1001",
    status: "pending",
    totalAmount: 2500
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const placeOrder = async () => {
  try {
    const orderVariables = {
      userId: 123,
      shopId: 1,
      voucherNo: "SAVE20", // or "1" for no coupon
      orderType: "cod", // or "online"
      customerId: 123,
      customerName: "John Doe",
      customerMobile: "9876543210",
      customerAddress: "123 Main St, Mumbai, Maharashtra - 400001",
      pickuptime: new Date().toISOString(),
      feedback: "",
      rating: 5,
      shopPhone: "9994424024",
      billingAddress: 1,
      shippingAddress: 1
    };
    
    const orderResponse = await ShopQuery.orderByCart.placeOrderByCart(orderVariables);
    
    if (orderResponse && orderResponse[0]?.id) {
      console.log('Order placed successfully!');
      console.log('Order ID:', orderResponse[0].id);
    } else {
      throw new Error('Failed to create order');
    }
  } catch (error) {
    console.error('Error placing order:', error);
  }
};
```

---

### Order History Module

Access via: `ShopQuery.orderHistory`

#### fetchOrderHistory

Retrieves order history for a user.

## Function

### `ShopQuery.orderHistory.fetchOrderHistory(userId, shopId)`

**Parameters:**
- `userId` (Number) - The user's ID
- `shopId` (Number) - The shop's ID

**Returns:** Array of order objects

**Sample Response:**
```javascript
[
  {
    id: 1001,
    orderId: "ORD-1001",
    orderDate: "2024-12-30T10:00:00Z",
    totalAmount: 2500,
    status: "delivered",
    items: [...]
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getOrderHistory = async () => {
  try {
    const userId = 123;
    const shopId = 1;
    const orders = await ShopQuery.orderHistory.fetchOrderHistory(userId, shopId);
    
    console.log('Order history:', orders);
    console.log('Total orders:', orders.length);
  } catch (error) {
    console.error('Error fetching order history:', error);
  }
};
```

---

### OTP Based Auth Module

Access via: `ShopQuery.otpAuth`

#### loginUserWithOTP

Sends an OTP to the user's mobile number.

## Function

### `ShopQuery.otpAuth.loginUserWithOTP(mobileNumber)`

**Parameters:**
- `mobileNumber` (String) - 10-digit mobile number

**Returns:** Success status

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const sendOTP = async () => {
  try {
    const mobileNumber = "9876543210";
    await ShopQuery.otpAuth.loginUserWithOTP(mobileNumber);
    console.log('OTP sent successfully');
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};
```

#### verifyOtp

Verifies the OTP and logs in the user.

## Function

### `ShopQuery.otpAuth.verifyOtp(mobileNumber, otp)`

**Parameters:**
- `mobileNumber` (String) - 10-digit mobile number
- `otp` (String) - 6-digit OTP

**Returns:** Object with success status and user ID

**Sample Response:**
```javascript
{
  success: true,
  userId: {
    id: 123,
    name: "John Doe",
    mobile: "9876543210"
  }
}
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const verifyUserOTP = async () => {
  try {
    const mobileNumber = "9876543210";
    const otp = "123456";
    
    const result = await ShopQuery.otpAuth.verifyOtp(mobileNumber, otp);
    
    if (result.success) {
      const userId = result.userId?.id || result.userId;
      console.log('Login successful! User ID:', userId);
      
      // Store user session
      localStorage.setItem('userId', userId);
    } else {
      console.log('Invalid OTP');
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
  }
};
```

---

### Payment Module

Access via: `ShopQuery.payment`

#### initiatePayment

Initiates an online payment transaction.

## Function

### `ShopQuery.payment.initiatePayment({ amount, name, number, phonePeId, phonePeKey, domain })`

**Parameters:**
- `amount` (Number) - Payment amount
- `name` (String) - Customer name
- `number` (String) - Customer phone
- `phonePeId` (String) - PhonePe merchant ID
- `phonePeKey` (String) - PhonePe API key
- `domain` (String) - Website domain

**Returns:** Payment response with redirect URL

**Sample Response:**
```javascript
{
  success: true,
  redirectUrl: "https://payment-gateway.com/pay/xyz123",
  transactionId: "TXN123456"
}
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const startPayment = async () => {
  try {
    const paymentVariables = {
      amount: 2500,
      name: "John Doe",
      number: "9876543210",
      phonePeId: "MERCHANT_ID",
      phonePeKey: "API_KEY",
      domain: window.location.origin
    };
    
    const paymentResponse = await ShopQuery.payment.initiatePayment(paymentVariables);
    
    if (paymentResponse && paymentResponse.success && paymentResponse.redirectUrl) {
      console.log('Redirecting to payment gateway...');
      window.location.href = paymentResponse.redirectUrl;
    } else {
      throw new Error(paymentResponse?.message || 'Failed to initiate payment');
    }
  } catch (error) {
    console.error('Payment error:', error);
  }
};
```

---

### Products Module

Access via: `ShopQuery.products`

#### getProductsController

Retrieves products for a shop or category.

## Function

### `ShopQuery.products.getProductsController(shopId, categoryId?)`

**Parameters:**
- `shopId` (Number) - The shop's ID
- `categoryId` (Number, optional) - Category ID to filter by

**Returns:** Array of product objects

**Sample Response:**
```javascript
[
  {
    id: 101,
    productId: 101,
    name: "Product Name",
    prize: 999,
    discount: 100,
    featureImage: "/uploads/product.jpg",
    category: "T-shirts",
    addedon: "2024-12-01T10:00:00Z",
    Specifications: [
      { specification: "Size", value: "M" },
      { specification: "Color", value: "Blue" }
    ]
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getProducts = async () => {
  try {
    const shopId = 1;
    const categoryId = 10; // optional
    
    const products = await ShopQuery.products.getProductsController(shopId, categoryId);
    
    console.log('Products:', products);
    console.log('Total products:', products.length);
    
    // Filter by price
    const affordableProducts = products.filter(p => p.prize < 1000);
    console.log('Affordable products:', affordableProducts.length);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
```

#### fetchProducts

Fetches a single product by ID.

## Function

### `ShopQuery.products.fetchProducts(productId)`

**Parameters:**
- `productId` (Number) - The product's ID

**Returns:** Product object

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getProductDetails = async () => {
  try {
    const productId = 101;
    const product = await ShopQuery.products.fetchProducts(productId);
    
    console.log('Product details:', product);
  } catch (error) {
    console.error('Error fetching product:', error);
  }
};
```

#### getProductByproductIdController

Fetches detailed information for a single product.

## Function

### `ShopQuery.products.getProductByproductIdController(productId, shopId)`

**Parameters:**
- `productId` (Number) - The product's ID
- `shopId` (Number) - The shop's ID

**Returns:** Product object (or array containing product object)

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getSingleProduct = async () => {
  try {
    const productId = 101;
    const shopId = 1;
    let productData = await ShopQuery.products.getProductByproductIdController(productId, shopId);

    // Handle if it returns an array
    if (Array.isArray(productData)) {
        productData = productData[0];
    }

    console.log('Product Name:', productData.name);
  } catch (error) {
    console.error('Error fetching product details:', error);
  }
};
```

---

### Product by Specification Module

Access via: `ShopQuery.productBySpecification`

#### getProductsBySpecification

Filters products by specifications and search term.

## Function

### `ShopQuery.productBySpecification.getProductsBySpecification({ shopId, specifications, searchKey? })`

**Parameters:**
- `shopId` (Number) - The shop's ID
- `specifications` (Array) - Array of specification objects
  - `mastername` (String) - Specification name (e.g., "Color", "Size")
  - `value` (String) - Specification value (e.g., "Red", "M")
- `searchKey` (String, optional) - Search term

**Returns:** Array of filtered product objects

**Sample Response:**
```javascript
[
  {
    id: 101,
    name: "Red T-Shirt",
    prize: 799,
    featureImage: "/uploads/product.jpg",
    Specifications: [
      { specification: "Color", value: "Red" },
      { specification: "Size", value: "M" }
    ]
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const filterProducts = async () => {
  try {
    const result = await ShopQuery.productBySpecification.getProductsBySpecification({
      shopId: 1,
      specifications: [
        { mastername: "Color", value: "Red" },
        { mastername: "Size", value: "M" }
      ],
      searchKey: "t-shirt"
    });
    
    console.log('Filtered products:', result);
    console.log('Found:', result.length, 'products');
  } catch (error) {
    console.error('Error filtering products:', error);
  }
};
```

---

### Register User Module

Access via: `ShopQuery.registerUser`

#### registerUser

Registers a new user account.

## Function

### `ShopQuery.registerUser.registerUser({ email, mobile, userName, password })`

**Parameters:**
- `email` (String) - User's email address
- `mobile` (String) - 10-digit mobile number
- `userName` (String) - User's name
- `password` (String) - Account password

**Returns:** Status code
- `1` - Registration successful
- `0` - User already registered
- `2` - Email already registered
- `3` - Username already registered

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const createAccount = async () => {
  try {
    const statusCode = Number(await ShopQuery.registerUser.registerUser({
      email: "john@example.com",
      mobile: "9876543210",
      userName: "John Doe",
      password: "SecurePass123"
    }));
    
    if (statusCode === 1) {
      console.log('Registration successful!');
    } else if (statusCode === 2) {
      console.log('Email already registered');
    } else if (statusCode === 3) {
      console.log('Username already taken');
    } else if (statusCode === 0) {
      console.log('User already exists');
    }
  } catch (error) {
    console.error('Registration error:', error);
  }
};
```

---

### Secondary Categories Module

Access via: `ShopQuery.secondaryCategories`

#### fetchSecondaryCategories

Retrieves subcategories under a master category.

## Function

### `ShopQuery.secondaryCategories.fetchSecondaryCategories(shopId, masterCategoryId)`

**Parameters:**
- `shopId` (Number) - The shop's ID
- `masterCategoryId` (Number) - Master category ID

**Returns:** Array of secondary category objects

**Sample Response:**
```javascript
[
  {
    id: 10,
    category: "T-Shirts",
    name: "T-Shirts",
    image: "/uploads/tshirts.jpg",
    masterCategoryId: 1
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getSubCategories = async () => {
  try {
    const shopId = 1;
    const masterCategoryId = 1; // Clothing
    
    const subCategories = await ShopQuery.secondaryCategories.fetchSecondaryCategories(shopId, masterCategoryId);
    
    console.log('Subcategories:', subCategories);
    
    // Find specific subcategory
    const tshirts = subCategories.find(c => 
      c.category.toLowerCase() === 't-shirts'
    );
    
    if (tshirts) {
      console.log('T-Shirts category ID:', tshirts.id);
    }
  } catch (error) {
    console.error('Error fetching subcategories:', error);
  }
};
```

---

### Shipping Cost Module

Access via: `ShopQuery.shippingCost`

#### fetchShippingCost

Retrieves shipping costs for a shop.

## Function

### `ShopQuery.shippingCost.fetchShippingCost(shopId)`

**Parameters:**
- `shopId` (Number) - The shop's ID

**Returns:** Array of shipping cost objects

**Sample Response:**
```javascript
[
  {
    id: 1,
    price: 50,
    minOrder: 0,
    maxOrder: 500
  },
  {
    id: 2,
    price: 0,
    minOrder: 500,
    maxOrder: 999999
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getShippingCost = async () => {
  try {
    const shopId = 1;
    const shippingCosts = await ShopQuery.shippingCost.fetchShippingCost(shopId);
    
    // Get the latest/default shipping cost
    const defaultShipping = shippingCosts[shippingCosts.length - 1];
    
    console.log('Shipping cost:', defaultShipping.price);
    
    // Calculate shipping based on order amount
    const orderAmount = 450;
    const applicableShipping = shippingCosts.find(s => 
      orderAmount >= s.minOrder && orderAmount <= s.maxOrder
    );
    
    console.log('Shipping for order:', applicableShipping?.price || 0);
  } catch (error) {
    console.error('Error fetching shipping cost:', error);
  }
};
```

---

### Shop Module

Access via: `ShopQuery.shop`

#### fetchShops

Retrieves shop information and configuration.

## Function

### `ShopQuery.shop.fetchShops({ id })`

**Parameters:**
- `id` (Number) - The shop's ID

**Returns:** Array with shop object

**Sample Response:**
```javascript
[
  {
    id: 1,
    name: "My Shop",
    phone: "9994424024",
    email: "shop@example.com",
    siteConfigurations: {
      razorpayKey: "rzp_key",
      razorpaySecretKey: "rzp_secret",
      phonePeId: "phonepe_id",
      phonePeKey: "phonepe_key"
    }
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getShopInfo = async () => {
  try {
    const shopId = 1;
    const shopData = await ShopQuery.shop.fetchShops({ id: shopId });
    
    if (shopData && shopData.length > 0) {
      const shop = shopData[0];
      console.log('Shop name:', shop.name);
      console.log('Shop phone:', shop.phone);
      
      // Check payment gateway configuration
      const config = shop.siteConfigurations;
      const hasPaymentGateway = 
        (config?.razorpayKey && config?.razorpaySecretKey) ||
        (config?.phonePeId && config?.phonePeKey);
      
      console.log('Payment gateway configured:', hasPaymentGateway);
    }
  } catch (error) {
    console.error('Error fetching shop info:', error);
  }
};
```

---

### State Module

Access via: `ShopQuery.state`

#### fetchState

Retrieves list of states/regions.

## Function

### `ShopQuery.state.fetchState()`

**Parameters:** None

**Returns:** Array of state objects

**Sample Response:**
```javascript
[
  {
    id: 1,
    name: "Maharashtra",
    code: "MH"
  },
  {
    id: 2,
    name: "Karnataka",
    code: "KA"
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getStates = async () => {
  try {
    const states = await ShopQuery.state.fetchState();
    
    console.log('Available states:', states);
    
    // Use in a dropdown
    const stateOptions = states.map(state => ({
      value: state.id,
      label: state.name
    }));
    
    console.log('State options:', stateOptions);
  } catch (error) {
    console.error('Error fetching states:', error);
  }
};
```

---

### Top Products Module

Access via: `ShopQuery.topproducts`

#### getTopProductsController

Retrieves featured/top products for a shop.

## Function

### `ShopQuery.topproducts.getTopProductsController(shopId)`

**Parameters:**
- `shopId` (Number) - The shop's ID

**Returns:** Array of top product objects

**Sample Response:**
```javascript
[
  {
    id: 101,
    name: "Bestseller Product",
    prize: 1299,
    discount: 200,
    featureImage: "/uploads/product.jpg",
    rating: 4.5,
    sales: 1500
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getTopProducts = async () => {
  try {
    const shopId = 1;
    const topProducts = await ShopQuery.topProducts.getTopProductsController(shopId);
    
    console.log('Top products:', topProducts);
    console.log('Featuring:', topProducts.length, 'products');
    
    // Display top 5
    const top5 = topProducts.slice(0, 5);
    console.log('Top 5 products:', top5);
  } catch (error) {
    console.error('Error fetching top products:', error);
  }
};
```

---

### Wishlist Module

Access via: `ShopQuery.wishlist`

#### getWishlistController

Retrieves user's wishlist.

## Function

### `ShopQuery.wishlist.getWishlistController(userId, shopId)`

**Parameters:**
- `userId` (Number) - The user's ID
- `shopId` (Number) - The shop's ID

**Returns:** Array of wishlist items

**Sample Response:**
```javascript
[
  {
    id: 1,
    productId: 101,
    name: "Wishlist Product",
    prize: 999,
    featureImage: "/uploads/product.jpg"
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getWishlist = async () => {
  try {
    const userId = 123;
    const shopId = 1;
    
    const wishlist = await ShopQuery.wishlist.getWishlistController(userId, shopId);
    
    console.log('Wishlist items:', wishlist);
    console.log('Total items:', wishlist.length);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
  }
};
```

#### addToWishlistController

Adds a product to the wishlist.

## Function

### `ShopQuery.wishlist.addToWishlistController(productId, shopId, userId)`

**Parameters:**
- `productId` (Number) - The product's ID
- `shopId` (Number) - The shop's ID
- `userId` (Number) - The user's ID

**Returns:** Success status

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const addToWishlist = async () => {
  try {
    const productId = 101;
    const shopId = 1;
    const userId = 123;
    
    const result = await ShopQuery.wishlist.addToWishlistController(productId, shopId, userId);
    
    console.log('Added to wishlist:', result);
    
    // Dispatch event to update UI
    window.dispatchEvent(new CustomEvent('wishlistUpdated', {
      detail: { productId, isWishlisted: true }
    }));
  } catch (error) {
    console.error('Error adding to wishlist:', error);
  }
};
```

#### removeFromWishlistController

Removes a product from the wishlist.

## Function

### `ShopQuery.wishlist.removeFromWishlistController(productId, shopId, userId)`

**Parameters:**
- `productId` (Number) - The product's ID
- `shopId` (Number) - The shop's ID
- `userId` (Number) - The user's ID

**Returns:** Success status

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const removeFromWishlist = async () => {
  try {
    const productId = 101;
    const shopId = 1;
    const userId = 123;
    
    await ShopQuery.wishlist.removeFromWishlistController(productId, shopId, userId);
    
    console.log('Removed from wishlist');
    
    // Dispatch event to update UI
    window.dispatchEvent(new CustomEvent('wishlistUpdated', {
      detail: { productId, isWishlisted: false }
    }));
  } catch (error) {
    console.error('Error removing from wishlist:', error);
  }
};
```

---

### Blog Module

Access via: `ShopQuery.blog`

#### fetchBlog

Retrieves blog posts for a shop.

## Function

### `ShopQuery.blog.fetchBlog(shopId)`

**Parameters:**
- `shopId` (Number) - The shop's ID

**Returns:** Array of blog post objects

**Sample Response:**
```javascript
[
  {
    id: 1,
    title: "Blog Post Title",
    content: "Blog content...",
    image: "/uploads/blog1.jpg",
    createdAt: "2024-12-01T10:00:00Z"
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getBlogPosts = async () => {
  try {
    const shopId = 1;
    const blogs = await ShopQuery.blog.fetchBlog(shopId);
    
    console.log('Blog posts:', blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }
};
```

---

### Customer Message Module

Access via: `ShopQuery.customerMessage`

#### sendCustomerMessage

Sends a customer message or inquiry.

## Function

### `ShopQuery.customerMessage.sendCustomerMessage({ shopId, name, email, phone, message })`

**Parameters:**
- `shopId` (Number) - The shop's ID
- `name` (String) - Customer name
- `email` (String) - Customer email
- `phone` (String) - Customer phone
- `message` (String) - Message content

**Returns:** Success status

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const sendMessage = async () => {
  try {
    await ShopQuery.customerMessage.sendCustomerMessage({
      shopId: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "9876543210",
      message: "I have a question about..."
    });
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
```

---

### Product Reviews Module

Access via: `ShopQuery.productReviews`

#### fetchProductReviews

Retrieves reviews for a product.

## Function

### `ShopQuery.productReviews.fetchProductReviews(productId)`

**Parameters:**
- `productId` (Number) - The product's ID

**Returns:** Array of review objects

**Sample Response:**
```javascript
[
  {
    id: 1,
    productId: 101,
    userId: 123,
    userName: "John Doe",
    rating: 5,
    review: "Great product!",
    createdAt: "2024-12-01T10:00:00Z"
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getReviews = async () => {
  try {
    const productId = 101;
    const reviews = await ShopQuery.productReviews.fetchProductReviews(productId);
    
    console.log('Product reviews:', reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
};
```

#### addProductReview

Adds a review for a product.

## Function

### `ShopQuery.productReviews.addProductReview({ productId, userId, rating, review })`

**Parameters:**
- `productId` (Number) - The product's ID
- `userId` (Number) - The user's ID
- `rating` (Number) - Rating (1-5)
- `review` (String) - Review text

**Returns:** Success status

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const addReview = async () => {
  try {
    await ShopQuery.productReviews.addProductReview({
      productId: 101,
      userId: 123,
      rating: 5,
      review: "Excellent product, highly recommended!"
    });
    console.log('Review added successfully');
  } catch (error) {
    console.error('Error adding review:', error);
  }
};
```

---

### Ratings Module

Access via: `ShopQuery.ratings`

#### fetchRatings

Retrieves ratings for a product.

## Function

### `ShopQuery.ratings.fetchRatings(productId)`

**Parameters:**
- `productId` (Number) - The product's ID

**Returns:** Rating statistics

**Sample Response:**
```javascript
{
  averageRating: 4.5,
  totalRatings: 150,
  ratingBreakdown: {
    5: 100,
    4: 30,
    3: 15,
    2: 3,
    1: 2
  }
}
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getRatings = async () => {
  try {
    const productId = 101;
    const ratings = await ShopQuery.ratings.fetchRatings(productId);
    
    console.log('Average rating:', ratings.averageRating);
    console.log('Total ratings:', ratings.totalRatings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
  }
};
```

---

### Specifications Module

Access via: `ShopQuery.specifications`

#### fetchSpecifications

Retrieves product specifications.

## Function

### `ShopQuery.specifications.fetchSpecifications(productId)`

**Parameters:**
- `productId` (Number) - The product's ID

**Returns:** Array of specification objects

**Sample Response:**
```javascript
[
  {
    specificationMaster: "Color",
    value: "Blue"
  },
  {
    specificationMaster: "Size",
    value: "M"
  },
  {
    specificationMaster: "Material",
    value: "Cotton"
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getSpecifications = async () => {
  try {
    const productId = 101;
    const specs = await ShopQuery.specifications.fetchSpecifications(productId);
    
    console.log('Product specifications:', specs);
  } catch (error) {
    console.error('Error fetching specifications:', error);
  }
};
```

---

### Product by Category Module

Access via: `ShopQuery.productByCategory`

#### getProductsByCategory

Retrieves products filtered by category.

## Function

### `ShopQuery.productbycategory.getProductsByCategoryController(categoryName, shopId)`

**Parameters:**
- `categoryName` (String) - The category's name
- `shopId` (Number) - The shop's ID

**Returns:** Array of product objects

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getProductsByCategory = async () => {
  try {
    const shopId = 1;
    const categoryName = "T-Shirts";
    const products = await ShopQuery.productbycategory.getProductsByCategoryController(categoryName, shopId);
    
    console.log('Products in category:', products);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
```

---

### Product by Price Module

Access via: `ShopQuery.productByPrice`

#### getProductsByPrice

Retrieves products filtered by price range.

## Function

### `ShopQuery.productByPrice.getProductsByPrice({ shopId, minPrice, maxPrice })`

**Parameters:**
- `shopId` (Number) - The shop's ID
- `minPrice` (Number) - Minimum price
- `maxPrice` (Number) - Maximum price

**Returns:** Array of product objects

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getProductsByPrice = async () => {
  try {
    const products = await ShopQuery.productByPrice.getProductsByPrice({
      shopId: 1,
      minPrice: 500,
      maxPrice: 2000
    });
    
    console.log('Products in price range:', products);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
```

---

### Search Products Module

Access via: `ShopQuery.searchProducts`

#### searchProducts

Searches for products by keyword.

## Function

### `ShopQuery.searchProducts.getSearchProductsController(shopId, searchKey)`

**Parameters:**
- `shopId` (Number) - The shop's ID
- `searchKey` (String) - Search keyword

**Returns:** Array of matching product objects

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const searchForProducts = async () => {
  try {
    const results = await ShopQuery.searchProducts.getSearchProductsController(1, "t-shirt");
    
    console.log('Search results:', results);
    console.log('Found:', results.length, 'products');
  } catch (error) {
    console.error('Error searching products:', error);
  }
};
```

---

### Forgot Password Module

Access via: `ShopQuery.forgotPassword`

#### sendPasswordResetLink

Sends a password reset link to user's email.

## Function

### `ShopQuery.forgotPassword.sendPasswordResetLink(email)`

**Parameters:**
- `email` (String) - User's email address

**Returns:** Success status

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const resetPassword = async () => {
  try {
    await ShopQuery.forgotPassword.sendPasswordResetLink("user@example.com");
    console.log('Password reset link sent');
  } catch (error) {
    console.error('Error sending reset link:', error);
  }
};
```

---

### Login Module

Access via: `ShopQuery.login`

#### loginUser

Logs in a user with email and password.

## Function

### `ShopQuery.login.loginUser(email, password)`

**Parameters:**
- `email` (String) - User's email
- `password` (String) - User's password

**Returns:** User object with authentication token

**Sample Response:**
```javascript
{
  success: true,
  user_id: 123,
  auth: "jwt_token_here",
  email: "john@example.com",
  user_name: "John Doe",
  mobile: "9876543210"
}
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const login = async () => {
  try {
    const result = await ShopQuery.login.loginUser("balavinoth99@gmail.com", "123456");
    
    if (result && result.user_id) {
      console.log('Login successful, User ID:', result.user_id);
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

---

### Nested Category Module

Access via: `ShopQuery.nestedCategory`

#### fetchNestedCategories

Retrieves nested category hierarchy.

## Function

### `ShopQuery.nestedCategory.fetchNestedCategories(shopId)`

**Parameters:**
- `shopId` (Number) - The shop's ID

**Returns:** Nested category tree

**Sample Response:**
```javascript
[
  {
    id: 1,
    name: "Clothing",
    children: [
      {
        id: 10,
        name: "T-Shirts",
        children: []
      },
      {
        id: 11,
        name: "Jeans",
        children: []
      }
    ]
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getNestedCategories = async () => {
  try {
    const shopId = 1;
    const categories = await ShopQuery.nestedCategory.fetchNestedCategories(shopId);
    
    console.log('Category hierarchy:', categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};
```

---

### Orders Module

Access via: `ShopQuery.orders`

#### fetchOrders

Retrieves all orders for a shop.

## Function

### `ShopQuery.orders.fetchOrders(shopId)`

**Parameters:**
- `shopId` (Number) - The shop's ID

**Returns:** Array of order objects

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getAllOrders = async () => {
  try {
    const shopId = 1;
    const orders = await ShopQuery.orders.fetchOrders(shopId);
    
    console.log('All orders:', orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};
```

#### updateOrderStatus

Updates the status of an order.

## Function

### `ShopQuery.orders.updateOrderStatus({ orderId, status })`

**Parameters:**
- `orderId` (Number) - The order's ID
- `status` (String) - New status (e.g., "pending", "processing", "shipped", "delivered")

**Returns:** Success status

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const updateStatus = async () => {
  try {
    await ShopQuery.orders.updateOrderStatus({
      orderId: 1001,
      status: "shipped"
    });
    console.log('Order status updated');
  } catch (error) {
    console.error('Error updating status:', error);
  }
};
```

---

### Payment Link Module

Access via: `ShopQuery.paymentLink`

#### generatePaymentLink

Generates a payment link for an order.

## Function

### `ShopQuery.paymentLink.generatePaymentLink({ orderId, amount, customerEmail })`

**Parameters:**
- `orderId` (Number) - The order's ID
- `amount` (Number) - Payment amount
- `customerEmail` (String) - Customer's email

**Returns:** Payment link object

**Sample Response:**
```javascript
{
  success: true,
  paymentLink: "https://payment.example.com/pay/xyz123",
  linkId: "LINK123"
}
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const createPaymentLink = async () => {
  try {
    const result = await ShopQuery.paymentLink.generatePaymentLink({
      orderId: 1001,
      amount: 2500,
      customerEmail: "customer@example.com"
    });
    
    console.log('Payment link:', result.paymentLink);
  } catch (error) {
    console.error('Error generating payment link:', error);
  }
};
```

---

### Promotion Module

Access via: `ShopQuery.promotion`

#### fetchPromotions

Retrieves active promotions for a shop.

## Function

### `ShopQuery.promotion.fetchPromotions(shopId)`

**Parameters:**
- `shopId` (Number) - The shop's ID

**Returns:** Array of promotion objects

**Sample Response:**
```javascript
[
  {
    id: 1,
    title: "Summer Sale",
    description: "Get 50% off on all items",
    discountPercentage: 50,
    startDate: "2024-06-01",
    endDate: "2024-06-30",
    status: "active"
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getPromotions = async () => {
  try {
    const shopId = 1;
    const promotions = await ShopQuery.promotion.fetchPromotions(shopId);
    
    console.log('Active promotions:', promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
  }
};
```

---

### User Order Details Module

Access via: `ShopQuery.userOrderDetails`

#### fetchUserOrderDetails

Retrieves detailed information about a specific order.

## Function

### `ShopQuery.userOrderDetails.fetchUserOrderDetails(orderId)`

**Parameters:**
- `orderId` (Number) - The order's ID

**Returns:** Detailed order object

**Sample Response:**
```javascript
{
  id: 1001,
  orderId: "ORD-1001",
  userId: 123,
  items: [
    {
      productId: 101,
      name: "Product Name",
      quantity: 2,
      price: 999
    }
  ],
  totalAmount: 2500,
  status: "delivered",
  shippingAddress: {...},
  paymentMethod: "cod",
  orderDate: "2024-12-01T10:00:00Z",
  deliveryDate: "2024-12-05T14:30:00Z"
}
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getOrderDetails = async () => {
  try {
    const orderId = 1001;
    const orderDetails = await ShopQuery.userOrderDetails.fetchUserOrderDetails(orderId);
    
    console.log('Order details:', orderDetails);
    console.log('Order status:', orderDetails.status);
  } catch (error) {
    console.error('Error fetching order details:', error);
  }
};
```

---

### Search Filter Module

Access via: `ShopQuery.searchFilter`

#### getSearchFilters

Retrieves available search filters for products.

## Function

### `ShopQuery.searchFilter.getSearchFilters(shopId)`

**Parameters:**
- `shopId` (Number) - The shop's ID

**Returns:** Array of filter options

**Sample Response:**
```javascript
{
  priceRanges: [
    { min: 0, max: 500 },
    { min: 500, max: 1000 },
    { min: 1000, max: 2000 }
  ],
  brands: ["Brand A", "Brand B", "Brand C"],
  colors: ["Red", "Blue", "Green"],
  sizes: ["S", "M", "L", "XL"]
}
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getFilters = async () => {
  try {
    const shopId = 1;
    const filters = await ShopQuery.searchFilter.getSearchFilters(shopId);
    
    console.log('Available filters:', filters);
  } catch (error) {
    console.error('Error fetching filters:', error);
  }
};
```

---

### Top Products Module

Access via: `ShopQuery.topproducts`

#### getTopProductsController

Retrieves featured/top products for a shop.

## Function

### `ShopQuery.topproducts.getTopProductsController(shopId)`

**Parameters:**
- `shopId` (Number) - The shop's ID

**Returns:** Array of top product objects

**Sample Response:**
```javascript
[
  {
    id: 101,
    name: "Top Product",
    prize: 1299,
    discount: 150,
    featureImage: "/uploads/product.jpg",
    category: "Electronics"
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getTopProducts = async () => {
  try {
    const shopId = 1;
    const topProducts = await ShopQuery.topproducts.getTopProductsController(shopId);
    
    console.log('Top products:', topProducts);
    console.log('Total top products:', topProducts.length);
  } catch (error) {
    console.error('Error fetching top products:', error);
  }
};
```

---

### Product by Category Module

Access via: `ShopQuery.productbycategory`

#### getProductsByCategoryController

Retrieves products filtered by a specific category.

## Function

### `ShopQuery.productbycategory.getProductsByCategoryController(categoryName, shopId)`

**Parameters:**
- `categoryName` (String) - The category name
- `shopId` (Number) - The shop's ID

**Returns:** Array of product objects in the specified category

**Sample Response:**
```javascript
[
  {
    id: 101,
    name: "Category Product",
    prize: 899,
    discount: 100,
    featureImage: "/uploads/product.jpg",
    category: "Clothing"
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const getProductsByCategory = async () => {
  try {
    const shopId = 1;
    const categoryName = "Clothing";
    const products = await ShopQuery.productbycategory.getProductsByCategoryController(categoryName, shopId);
    
    console.log('Products in category:', products);
    console.log('Total products:', products.length);
  } catch (error) {
    console.error('Error fetching products by category:', error);
  }
};
```

---

### Search Products Module

Access via: `ShopQuery.searchProducts`

#### getSearchProductsController

Searches for products based on a search query.

## Function

### `ShopQuery.searchProducts.getSearchProductsController(shopId, searchQuery)`

**Parameters:**
- `shopId` (Number) - The shop's ID
- `searchQuery` (String) - The search term

**Returns:** Array of product objects matching the search query

**Sample Response:**
```javascript
[
  {
    id: 101,
    name: "Searched Product",
    prize: 599,
    discount: 50,
    featureImage: "/uploads/product.jpg",
    category: "Accessories"
  }
]
```

**JavaScript Usage:**
```javascript
import ShopQuery from 'shops-query';

const searchProducts = async () => {
  try {
    const shopId = 1;
    const searchQuery = "laptop";
    const products = await ShopQuery.searchProducts.getSearchProductsController(shopId, searchQuery);
    
    console.log('Search results:', products);
    console.log('Total results:', products.length);
  } catch (error) {
    console.error('Error searching products:', error);
  }
};
```

---

## Complete Usage Example

Here's a complete example showing how to build a product listing page with cart and wishlist functionality:

```javascript
import React, { useState, useEffect } from 'react';
import ShopQuery from 'shops-query';

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const shopId = 1;
  const userId = 123; // Get from auth context

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch master categories
        const masterCats = await ShopQuery.mastercategories.fetchMasterCategories(shopId);
        setCategories(masterCats);
        
        // Fetch products
        const allProducts = await ShopQuery.products.getProductsController(shopId);
        setProducts(allProducts);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await ShopQuery.cart.addToCart({
        userId,
        productId,
        shopId,
        quantity: 1
      });
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      await ShopQuery.wishlist.addToWishlistController(productId, shopId, userId);
      alert('Added to wishlist!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Products</h1>
      
      {/* Categories */}
      <div className="categories">
        {categories.map(cat => (
          <div key={cat.id}>{cat.category}</div>
        ))}
      </div>
      
      {/* Products Grid */}
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={`/uploads/${product.featureImage}`} alt={product.name} />
            <h3>{product.name}</h3>
            <p>₹{product.prize}</p>
            
            <button onClick={() => handleAddToCart(product.productId)}>
              Add to Cart
            </button>
            
            <button onClick={() => handleAddToWishlist(product.productId)}>
              Add to Wishlist
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListingPage;
```

---

## Error Handling

All API functions may throw errors. Always wrap calls in try-catch blocks:

```javascript
try {
  const result = await ShopQuery.someModule.someFunction(params);
  // Handle success
} catch (error) {
  console.error('API Error:', error);
  // Handle error - show user-friendly message
}
```

---

## Notes

1. **Shop ID**: Most functions require a `shopId`. Store this as a constant or in environment variables.
2. **User ID**: User-specific operations require `userId`. Get this from your authentication context.
3. **Image Paths**: Image paths returned are relative. Prepend with your image server URL.
4. **GraphQL**: The package uses GraphQL internally. Ensure your backend GraphQL server is properly configured.
5. **Type Conversion**: Some parameters require explicit type conversion (e.g., `Number(userId)`).
6. **Single Import**: Always use `import ShopQuery from 'shops-query'` - do not use named imports.

---

## Support

For issues or questions about the `shops-query` package, contact the development team or refer to the internal documentation.

---

**Last Updated:** December 30, 2024  
**Version:** 0.3
