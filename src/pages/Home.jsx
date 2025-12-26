import React from 'react';
import CategorySection from '../components/CategorySection';
import { motion } from 'framer-motion';
import { useShop } from '../context/ShopContext';

const Home = () => {
    const { categoryStructure, banners, loading } = useShop();

    if (loading) {
        return (
            <div style={{ padding: '5rem', textAlign: 'center' }}>
                <div className="loading-spinner"></div>
                <p>Loading your products...</p>
            </div>
        );
    }

    if (!categoryStructure || categoryStructure.length === 0) {
        return (
            <div style={{ padding: '5rem', textAlign: 'center' }}>
                <p>No products found for this shop.</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >

            {/* Hierarchical Display - Sub-Categories and Products (Doc Point 3 & 7) */}
            <div className="categories-wrapper">
                {categoryStructure.map((masterNode, index) => (
                    <CategorySection
                        key={masterNode.master}
                        category={masterNode.master}
                        subCategories={masterNode.subCategories}
                        index={index}
                    />
                ))}
            </div>
        </motion.div>
    );
};

export default Home;
