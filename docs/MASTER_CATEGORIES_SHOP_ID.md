# Master Categories API Documentation

This document describes how to fetch master categories using the shops-query package.

## Overview

Master categories are the top-level product categories for a shop.

## Import

```javascript
import ShopQuery from "shops-query";
```

## Function

### `ShopQuery.masterCategories.fetchMasterCategories(shopId)`

Retrieves all master categories for a shop.

**Parameters:**
- `shopId` (Number) - The unique shop identifier

**Returns:** Array of category objects:
```javascript
[
  { category: "Electronics" },
  { category: "Clothing" },
  { category: "Home & Kitchen" }
]
```

## Usage Example

```javascript
import ShopQuery from 'shops-query';

// Fetch master categories
const masterCategories = await ShopQuery.masterCategories.fetchMasterCategories(shopId);
console.log('Master categories:', masterCategories);

// Access category names
masterCategories.forEach((cat) => {
  console.log(cat.category); // "Electronics", "Clothing", etc.
});
```

## React Implementation

```javascript
import { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import ShopQuery from 'shops-query';

const MyComponent = () => {
  const { shopId } = useShop();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      if (!shopId) return;
      
      try {
        setLoading(true);
        const masterCategories = await ShopQuery.masterCategories.fetchMasterCategories(shopId);
        setCategories(masterCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [shopId]);

  return (
    <div>
      {categories.map((cat) => (
        <div key={cat.category}>{cat.category}</div>
      ))}
    </div>
  );
};
```

## Base URL

`https://api.shop.strackit.com/graphql`
