import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { 
  Navbar,
  CartSidebar,
  ViewCart,
  Footer
} from './Home/components';
import HomePage from './Home/pages/HomePage';
import './App.css';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  return (
    <Router>
      <div className="App">
        <Navbar 
          cartCount={cartItemCount}
          onCartClick={handleCartClick}
        />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<ViewCart />} />
        </Routes>
        
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
        
        {/* Cart Sidebar */}
        <CartSidebar 
          isOpen={isCartOpen}
          onClose={handleCartClose}
          cartItemCount={cartItemCount}
          setCartItemCount={setCartItemCount}
        />
      </div>
    </Router>
  );
}

export default App;
