# 🛍️ GraphQL E-commerce Backend

This project is a modular **GraphQL-based backend** for managing an e-commerce platform. It supports querying and mutating data for categories, products, cart, wishlist, reviews, offers, and real-time order updates.

Built for clean controller-query architecture and easily testable GraphQL module logic.

# 🛒 Shops Query GraphQL API

A modular GraphQL backend project to query shop-related data such as products, categories, reviews, wishlist, and cart functionality.

## 🚀 Features

- ✅ Modular GraphQL schema & resolvers
- 🛍️ Product, Category, and MasterCategory queries
- ❤️ Wishlist (add/remove/fetch)
- 🛒 Cart management (add/remove/fetch)
- 🔍 Product search, filters, and price range
- 📦 Products by category and top products
- 🔔 Real-time order updates with GraphQL subscriptions

---
📁 Project Structure

graphql-project/src/modules/ cart/
│ │ │ ├── controller/get/ index.js , add/index.js , remove/index.js
│ │ │ ├── mutations/add.js
│ │ │ ├── mutations/remove.js
│ │ │ └── queries/get.js 

graphql-project/src/modules/ categories/
│ │ │ ├── controller/get/index.js
│ │ │ └── queries/get.js

graphql-project/src/modules/ masterCategories/
│ │ │ ├── controller/get/index.js
│ │ │ └── queries/get.js

graphql-project/src/modules/ nestedCategory/
│ │ │ ├── controller/get/index.js
│ │ │ └── queries/get.js

 graphql-project/src/modules/ offerProducts/
 │ │ │ ├── controller/get/index.js
 │  │ │ └── queries/get.js 

 graphql-project//src/modules/ productReviews/
│ │ │ ├── controller/get/index.js , add/index.js , edit/index.js
│ │ │ └── queries/get.js
| | |__ mutations/add.js
| │ │ |__ mutations/edit.js

 graphql-project//src/modules/ products/
│ │ │ ├── controller/get/index.js 
│ │ │ └── queries/get.js

 graphql-project//src/modules/ wishlist/
│ │ │ ├── controller/get/index.js,add/index.js , remove/index.js 
│ │ │ └── queries/get.js
| | | |__ mutations/add.js 
| │ │ |__ mutations/remove.js
 graphql-project//src/modules/ topProducts/
│ │ │ ├── controller/get/index.js
│ │ │ └── queries/get.js

 graphql-project//src/modules/productByCategory/
│ │ │ ├── controller/get/index.js
│ │ │ └── queries/get.js

 graphql-project//src/modules/productByFilters/
│ │ │ ├── controller/get/index.js
│ │ │ └── queries/get.js

 graphql-project//src/modules/ productByPrice/
│ │ │ ├── controller/get/index.js
│ │ │ └── queries/get.js 

 graphql-project//src/modules/ searchproducts/
│ │ │ ├── controller/get/index.js 
│ │ │ └── queries/get.js

 graphql-project//src/modules/ orderUpdates/
│ │ │ ├── controller/listen/index.js
│ │ │ └── queries/listen.js

graphql-project//src/ utils/ client.js
graphql-project/.env
graphql-project/index.js
graphql-project/test.js 
graphql-project/README.md
graphql-project/package.json 

---

## ⚙️ Setup Instructions

### 1. 📦 Install dependencies

```bash
         npm install
```

---

### 2. 🧪 Add environment variables

Create a `.env` file in the project root:

```env
GRAPHQL_API_URL=https://test.api.shop.strackit.com/graphql
```

---

### 3. ✅ Run All Tests

Run this to test all modules from a single file:

```bash
node test.js
```

> Test output will log responses or errors for each module.

---


## 🧠 Supported Modules & Features
 ---------------------------------------------------------------------
| Module                 | Description                                |
|------------------------|--------------------------------------------|
| `categories`           | Fetch categories based on `shopId`         |
| `masterCategories`     | Top-level categories across shops          |
| `nestedCategory`       | Multi-level category hierarchy             |
| `offerProducts`        | Fetch products with discounts              |
| `productReviews`       | Fetch/edit reviews for products            |
| `products`             | Fetch products list                        |
| `cart`                 | Add/remove/fetch cart data                 |
| `wishlist`             | Add/remove/fetch wishlist data             |
| `topProducts`          | Fetch popular products                     |
| `productByCategory`    | Products filtered by category              |
| `productByFilters`     | Products filtered by multiple conditions   |
| `productByPrice`       | Products filtered by price range           |
| `searchproducts`       | Search for products using keywords         |
| `orderUpdates`         | Real-time order status subscription        |
-----------------------------------------------------------------------

---


## 🚧 Common Issues

1. `fetch failed`       ---- Network issue or GraphQL API is unreachable 

2. `shopId: undefined`   ---- `shopId` not passed to controller or test file      

3. `client is not defined`  ---- Improper or missing import in queries/controllers   

4. `ERR_MODULE_NOT_FOUND`    ---- Incorrect path while importing modules              

5. `Server Side Error`       ----- Server-side error in GraphQL API adding resolvers 

6. `TypeError: Cannot read properties of undefined (reading 'id')`   
---

## Technologies

Node.js

Apollo Client (for sending queries/mutations)

GraphQL (queries, mutations, subscriptions)

dotenv

---

## 📄 License

This codebase is intended for educational and internal development use only.
