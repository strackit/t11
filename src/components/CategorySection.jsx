import React, { useState } from 'react';
import ProductRow from './ProductRow';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';

const CategorySection = ({ category, products, index, subCategories }) => {
    // If we have subCategories, we render a more nested structure
    // category here is the Master Category name

    const [isMasterOpen, setIsMasterOpen] = useState(index === 0);
    const [openSubIndex, setOpenSubIndex] = useState(0); // Default open first subcategory

    if (subCategories && subCategories.length > 0) {
        return (
            <div className="category-section" style={{ marginBottom: '1.5rem' }}>
                <motion.div
                    className="category-header"
                    onClick={() => setIsMasterOpen(!isMasterOpen)}
                    style={{
                        padding: '1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--secondary)',
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        marginBottom: '0.5rem'
                    }}
                >
                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                        {category.toUpperCase()}
                    </h2>
                    {isMasterOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </motion.div>

                <AnimatePresence>
                    {isMasterOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden', paddingLeft: '1rem' }}
                        >
                            {subCategories.map((sub, sIdx) => (
                                <div key={sub.name} style={{ marginBottom: '1rem' }}>
                                    <div
                                        onClick={() => setOpenSubIndex(openSubIndex === sIdx ? -1 : sIdx)}
                                        style={{
                                            padding: '0.6rem 0.5rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            borderBottom: '1px solid var(--border)',
                                            color: openSubIndex === sIdx ? 'var(--accent)' : 'var(--text-secondary)',
                                            fontWeight: 600
                                        }}
                                    >
                                        {openSubIndex === sIdx ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                        {sub.name}
                                        <span style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: 400 }}>
                                            ({sub.products.length})
                                        </span>
                                    </div>

                                    {openSubIndex === sIdx && (
                                        <div className="products-list" style={{ marginTop: '0.5rem' }}>
                                            {sub.products.map((product, pIdx) => (
                                                <ProductRow
                                                    key={product.id || pIdx}
                                                    product={product}
                                                    index={pIdx}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // Fallback for simple flat display
    return (
        <div className="category-section" style={{ marginBottom: '1rem' }}>
            <motion.div
                className="category-header"
                onClick={() => setIsMasterOpen(!isMasterOpen)}
                style={{
                    padding: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--secondary)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    marginBottom: '0.5rem'
                }}
            >
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                    {category.toUpperCase()}
                </h2>
                {isMasterOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </motion.div>

            <AnimatePresence>
                {isMasterOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="products-list"
                        style={{ overflow: 'hidden' }}
                    >
                        {products.map((product, pIdx) => (
                            <ProductRow key={product.id || pIdx} product={product} index={pIdx} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategorySection;
