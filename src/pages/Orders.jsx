import React from 'react';
import { useShop } from '../context/ShopContext';
import { motion } from 'framer-motion';

const Orders = () => {
    const { orders } = useShop();

    return (
        <motion.div
            className="page-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
        >
            <h1 className="page-title">My Orders</h1>

            {orders.length === 0 ? (
                <p className="empty-state">No orders yet.</p>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <h3>Order #{order.id}</h3>
                                <span className="order-date">{order.date}</span>
                            </div>
                            <div className="order-items">
                                {order.items.map((item, i) => (
                                    <span key={i} className="order-item-name">{item.name}{i < order.items.length - 1 ? ', ' : ''}</span>
                                ))}
                            </div>
                            <div className="order-total">
                                <strong>Total: Rs.{order.total.toFixed(2)}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default Orders;
