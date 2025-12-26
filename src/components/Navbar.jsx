import React, { useState } from 'react';
import { ShoppingBag, Heart, ListOrdered, Sun, Moon, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import AuthModal from './AuthModal';

const Navbar = ({ theme, toggleTheme }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user, logout, cart } = useShop();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <>
            <motion.header
                className="header"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="header-item">
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <span className="title-logo">ESSIENCE</span>
                    </Link>
                </div>
                <div className="header-links">
                    <motion.button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Toggle Theme"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </motion.button>
                    <Link
                        to="/wishlist"
                        className="nav-item"
                    >
                        <Heart size={18} className="nav-icon" />
                        <span className="nav-text">WISHLIST</span>
                    </Link>
                    <Link
                        to="/cart"
                        className="nav-item"
                    >
                        <div style={{ position: 'relative' }}>
                            <ShoppingBag size={18} className="nav-icon" />
                            {cart.length > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '4px',
                                    background: 'var(--accent)',
                                    color: 'white',
                                    fontSize: '0.6rem',
                                    width: '14px',
                                    height: '14px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>{cart.length}</span>
                            )}
                        </div>
                        <span className="nav-text">CART</span>
                    </Link>
                    <Link
                        to="/orders"
                        className="nav-item"
                    >
                        <ListOrdered size={18} className="nav-icon" />
                        <span className="nav-text">ORDERS</span>
                    </Link>

                    {user ? (
                        <div
                            className="nav-item"
                            style={{ cursor: 'pointer', position: 'relative' }}
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                        >
                            <User size={18} className="nav-icon" />
                            <span className="nav-text">{user.name}</span>

                            <AnimatePresence>
                                {showProfileMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            background: 'var(--secondary)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                            padding: '0.5rem',
                                            minWidth: '120px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            zIndex: 1000
                                        }}
                                    >
                                        <button
                                            onClick={logout}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                width: '100%',
                                                textAlign: 'left',
                                                padding: '0.5rem',
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                fontWeight: 500
                                            }}
                                        >
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <motion.button
                            className="nav-item"
                            onClick={() => setIsModalOpen(true)}
                            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                            style={{ background: 'none', border: 'none', fontSize: 'inherit', fontFamily: 'inherit' }}
                        >
                            <User size={18} className="nav-icon" />
                            <span className="nav-text">LOGIN</span>
                        </motion.button>
                    )}
                </div>
            </motion.header>
            <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default Navbar;
