# Secondary Categories API Documentation

This document describes how to fetch secondary categories using the shops-query package.

## Overview

Secondary categories are sub-categories within a master category. They are fetched using a master category ID.

## Import

```javascript
import ShopQuery from "shops-query";
```

## Function

### `ShopQuery.SecondaryCategories.fetchSecondaryCategories(shopId, masterCategoryId)`

Retrieves secondary categories for a specific master category.

**Parameters:**
- `shopId` (Number) - The unique shop identifier
- `masterCategoryId` (Number/String) - The master category ID

**Returns:** Array of secondary category objects

## Usage Example

```javascript
import ShopQuery from 'shops-query';

// First fetch master categories
const masterCategories = await ShopQuery.mastercategories.fetchMasterCategories(shopId);

// Then fetch secondary categories for each master category
for (const masterCat of masterCategories) {
  const secondaryCategories = await ShopQuery.SecondaryCategories.fetchSecondaryCategories(
    shopId, 
    masterCat.id
  );
  console.log(`Secondary categories for ${masterCat.category}:`, secondaryCategories);
}
```

## Data Flow

```
1. fetchMasterCategories(shopId)
   → Returns: [{ id: 1, category: "Electronics" }, ...]
                    ↓
2. For each master category:
   fetchSecondaryCategories(shopId, masterCat.id)
   → Returns: Array of secondary categories
                    ↓
3. Flatten for display:
   [{ category: "Phones", masterCategory: "Electronics" }, ...]
```

## Base URL

`https://api.shop.strackit.com/graphql`
