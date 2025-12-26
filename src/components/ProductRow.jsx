import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { Heart } from 'lucide-react';

const ProductRow = ({ product, index }) => {
    const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useShop();
    const [imgError, setImgError] = useState(false);

    const isWishlisted = wishlist.some(item => item.id === product.id);

    return (
        <motion.div
            className="product-row"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            {!imgError && product.image && (
                <div className="product-image-container">
                    <motion.img
                        src={product.image}
                        alt={product.name}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        onError={() => setImgError(true)}
                    />
                </div>
            )}
            <div className="product-details">
                <div className="product-name">
                    {product.name}
                </div>
                <div className="product-price">Rs.{product.price}</div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                    className="wishlist-btn"
                    onClick={() => isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        color: isWishlisted ? 'var(--accent)' : 'var(--text-secondary)',
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <Heart size={18} fill={isWishlisted ? "var(--accent)" : "none"} />
                </button>
                <motion.button
                    className="add-button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToCart(product)}
                >
                    Add
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ProductRow;
