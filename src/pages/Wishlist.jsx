import React from 'react';
import { useShop } from '../context/ShopContext';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag } from 'lucide-react';

const Wishlist = () => {
    const { wishlist, removeFromWishlist, addToCart } = useShop();

    return (
        <motion.div
            className="page-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
        >
            <h1 className="page-title">My Wishlist</h1>

            {wishlist.length === 0 ? (
                <p className="empty-state">Your wishlist is empty.</p>
            ) : (
                <div className="cart-list">
                    {wishlist.map((item) => (
                        <div key={item.id} className="cart-item">
                            <div className="item-info">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="cart-item-img" onError={(e) => e.target.style.display = 'none'} />
                                ) : null}
                                <div>
                                    <h4>{item.name}</h4>
                                    <p>Rs.{item.price}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <button
                                    onClick={() => addToCart(item)}
                                    className="add-button"
                                    style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}
                                >
                                    Add to Cart
                                </button>
                                <button onClick={() => removeFromWishlist(item.id)} className="remove-btn">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default Wishlist;
