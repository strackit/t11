# Products by Category API Documentation

This document describes how to fetch products by category using the shops-query package.

## Import

```javascript
import ShopQuery from "shops-query";
```

## Function

### `ShopQuery.productbycategory.getProductsByCategoryController(masterCategoryName, shopId, secondaryCategoryName)`

Retrieves products for a specific secondary category.

**Parameters:**
- `masterCategoryName` (String) - The master/parent category name
- `shopId` (Number) - The unique shop identifier
- `secondaryCategoryName` (String) - The secondary category name

**Returns:** Array of product objects with properties:
- `id` - Product ID
- `name` - Product name
- `description` - Product description (may contain HTML)
- `featureImage` - Relative image path (requires S3 prefix)
- `prize` - Product price
- `discount` - Discount percentage
- `tax` - Tax percentage

## Usage Example

```javascript
import ShopQuery from 'shops-query';

const products = await ShopQuery.productbycategory.getProductsByCategoryController(
  'Electronics',  // masterCategoryName
  518,            // shopId
  'Phones'        // secondaryCategoryName
);

console.log('Products:', products);
```

## Image URL Helper

Product images require S3 bucket prefix. Use the helper from constants:

```javascript
import { getImageUrl } from '../constants';

// Usage
<img src={getImageUrl(product.featureImage)} alt={product.name} />
```

**S3 Prefix:** `https://s3.ap-south-1.amazonaws.com/business.strackit.com/`

## Rendering HTML Description

Product descriptions may contain HTML. Use `dangerouslySetInnerHTML`:

```javascript
<p dangerouslySetInnerHTML={{ __html: product.description }} />
```

## Complete Data Flow

```
1. fetchMasterCategories(shopId)
   → [{ id, category }]
         ↓
2. fetchSecondaryCategories(shopId, masterCat.id)
   → [{ category, name }]
         ↓
3. getProductsByCategoryController(masterCategoryName, shopId, secondaryCategoryName)
   → [{ id, name, description, featureImage, prize, ... }]
```

## Base URL

`https://api.shop.strackit.com/graphql`
