import React from 'react';
import { useShop } from '../context/ShopContext';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

const Cart = () => {
    const { cart, removeFromCart, placeOrder } = useShop();

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <motion.div
            className="page-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
        >
            <h1 className="page-title">Shopping Cart</h1>

            {cart.length === 0 ? (
                <div className="empty-state">
                    <p>Your cart is empty.</p>
                </div>
            ) : (
                <>
                    <div className="cart-list">
                        {cart.map((item) => (
                            <div key={item.cartItemId || item.id} className="cart-item">
                                <div className="item-info">
                                    <img src={item.image} alt={item.name} className="cart-item-img" />
                                    <div>
                                        <h4 style={{ margin: 0 }}>{item.name}</h4>
                                        <p style={{ margin: '4px 0', opacity: 0.8 }}>Rs.{item.price} x {item.quantity}</p>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary" style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--secondary)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span>Total Amount:</span>
                            <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--accent)' }}>Rs.{total.toFixed(2)}</span>
                        </div>
                        <button onClick={placeOrder} className="submit-btn" style={{ width: '100%', padding: '1rem', borderRadius: '8px' }}>
                            Place Order
                        </button>
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default Cart;
