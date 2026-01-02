import { useState, useEffect } from 'react';
import { useApp } from '../../../shared/context/AppContext';
import { useShop } from '../../../shared/context/ShopContext';
import { OrderAPI, AddressAPI } from '../../../shared/services/api';
import './CheckoutModal.css';

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const CheckoutModal = ({ isOpen, onClose, onOrderPlaced, cartTotal }) => {
  const { user, clearCart } = useApp();
  const { shopId, shop } = useShop();
  
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerMobile: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    orderType: 'cod'
  });
  
  const [loading, setLoading] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [saveAddressChecked, setSaveAddressChecked] = useState(true);
  const [error, setError] = useState('');

  // Helper to decode JWT and get userId
  const getUserIdFromToken = () => {
    try {
      console.log('getUserIdFromToken: user object:', user);
      
      if (!user) {
        console.log('getUserIdFromToken: user is null/undefined');
        return null;
      }
      
      // The cookie stores a JSON object with 'auth' key containing the JWT
      const token = user.auth || user.auth_token || user.token;
      console.log('getUserIdFromToken: token:', token ? token.substring(0, 50) + '...' : 'null');
      
      if (!token) {
        console.log('getUserIdFromToken: no token found in user object. Keys:', Object.keys(user));
        return null;
      }
      
      // Decode JWT payload
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      console.log('getUserIdFromToken: decoded payload:', decoded);
      
      // Get user_id from decoded payload
      const userId = decoded?.user_id || decoded?.userId || decoded?.id;
      console.log('getUserIdFromToken: extracted userId:', userId);
      
      return userId || null;
    } catch (err) {
      console.error('getUserIdFromToken: error decoding token:', err);
      return null;
    }
  };

  // Fetch saved addresses when modal opens
  useEffect(() => {
    const fetchAddresses = async () => {
      console.log('CheckoutModal: useEffect triggered, isOpen:', isOpen, 'user:', user);
      
      if (!isOpen) {
        console.log('CheckoutModal: Modal not open, skipping fetch');
        return;
      }
      
      const userId = getUserIdFromToken();
      console.log('CheckoutModal: userId from token:', userId);
      
      if (!userId) {
        console.log('CheckoutModal: No userId, showing new address form');
        setShowNewAddressForm(true);
        setLoadingAddresses(false);
        return;
      }

      setLoadingAddresses(true);
      try {
        console.log('CheckoutModal: Fetching addresses for userId:', userId);
        const addresses = await AddressAPI.fetchAddresses(userId);
        console.log('CheckoutModal: Addresses received:', addresses);
        setSavedAddresses(addresses || []);
        
        // If addresses exist, select the first one by default
        if (addresses && addresses.length > 0) {
          setSelectedAddressId(addresses[0].id);
          setShowNewAddressForm(false);
        } else {
          setShowNewAddressForm(true);
        }
      } catch (err) {
        console.error('CheckoutModal: Error fetching addresses:', err);
        setShowNewAddressForm(true);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [isOpen, user]);

  // Pre-fill user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.user_name || user.name || '',
        customerMobile: user.mobile || ''
      }));
    }
  }, [user]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setError('');
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    setShowNewAddressForm(false);
  };

  const handleNewAddressClick = () => {
    setSelectedAddressId(null);
    setShowNewAddressForm(true);
  };

  const getSelectedAddress = () => {
    return savedAddresses.find(addr => addr.id === selectedAddressId);
  };

  const validateAddressFields = () => {
    if (!formData.street.trim()) return 'Please enter your street address';
    if (!formData.city.trim()) return 'Please enter your city';
    if (!formData.state.trim()) return 'Please enter your state';
    if (!formData.pincode.trim()) return 'Please enter your pincode';
    if (!/^\d{6}$/.test(formData.pincode.trim())) return 'Please enter a valid 6-digit pincode';
    return null;
  };

  const handleSaveAddress = async () => {
    const addressError = validateAddressFields();
    if (addressError) {
      setError(addressError);
      return;
    }

    const userId = getUserIdFromToken();
    if (!userId) {
      setError('Please login to save address');
      return;
    }

    setSavingAddress(true);
    setError('');

    try {
      await AddressAPI.saveAddress({
        userId,
        name: formData.customerName.trim() || 'Home',
        phone: formData.customerMobile.trim(),
        street: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim()
      });

      // Refresh addresses list
      const addresses = await AddressAPI.fetchAddresses(userId);
      setSavedAddresses(addresses || []);
      
      // Select the newly added address (last one)
      if (addresses && addresses.length > 0) {
        const newAddress = addresses[addresses.length - 1];
        setSelectedAddressId(newAddress.id);
        setShowNewAddressForm(false);
        // Clear form fields
        setFormData(prev => ({
          ...prev,
          street: '',
          city: '',
          state: '',
          pincode: ''
        }));
      }
    } catch (err) {
      console.error('Error saving address:', err);
      setError('Failed to save address. Please try again.');
    } finally {
      setSavingAddress(false);
    }
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) return 'Please enter your name';
    if (!formData.customerMobile.trim()) return 'Please enter your mobile number';
    if (!/^\d{10}$/.test(formData.customerMobile.trim())) return 'Please enter a valid 10-digit mobile number';
    
    // If using new address form, validate address fields
    if (showNewAddressForm) {
      if (!formData.street.trim()) return 'Please enter your street address';
      if (!formData.city.trim()) return 'Please enter your city';
      if (!formData.state.trim()) return 'Please enter your state';
      if (!formData.pincode.trim()) return 'Please enter your pincode';
      if (!/^\d{6}$/.test(formData.pincode.trim())) return 'Please enter a valid 6-digit pincode';
    } else if (!selectedAddressId) {
      return 'Please select a delivery address';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const userId = getUserIdFromToken();
    if (!userId) {
      setError('Please login to place an order');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let fullAddress;
      let addressId = 0;

      if (showNewAddressForm) {
        // Using new address
        fullAddress = `${formData.street}, ${formData.city}, ${formData.state} - ${formData.pincode}`;
      } else {
        // Using saved address
        const selectedAddr = getSelectedAddress();
        if (selectedAddr) {
          fullAddress = `${selectedAddr.street}, ${selectedAddr.city}, ${selectedAddr.state} - ${selectedAddr.pincode}`;
          addressId = selectedAddr.id;
        }
      }
      
      const orderResponse = await OrderAPI.placeOrder({
        userId,
        shopId,
        orderType: formData.orderType,
        customerName: formData.customerName.trim(),
        customerMobile: formData.customerMobile.trim(),
        customerAddress: fullAddress,
        voucherNo: '1',
        billingAddress: addressId,
        shippingAddress: addressId,
        shopPhone: shop?.phone || ''
      });

      if (orderResponse && orderResponse[0]?.id) {
        clearCart();
        onOrderPlaced(orderResponse[0]);
      } else {
        throw new Error('Failed to place order');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="checkout-modal-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={e => e.stopPropagation()}>
        <div className="checkout-modal-header">
          <h2>Checkout</h2>
          <button className="close-btn" onClick={onClose} disabled={loading}>
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          {error && <div className="checkout-error">{error}</div>}

          <div className="form-section">
            <h3>Contact Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customerName">Full Name *</label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="customerMobile">Mobile Number *</label>
                <input
                  type="tel"
                  id="customerMobile"
                  name="customerMobile"
                  value={formData.customerMobile}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  maxLength={10}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Delivery Address</h3>
            
            {loadingAddresses ? (
              <div className="addresses-loading">Loading saved addresses...</div>
            ) : (
              <>
                {/* Saved Addresses List */}
                {savedAddresses.length > 0 && (
                  <div className="saved-addresses">
                    {savedAddresses.map((address) => (
                      <div
                        key={address.id}
                        className={`address-card ${selectedAddressId === address.id && !showNewAddressForm ? 'selected' : ''}`}
                        onClick={() => handleAddressSelect(address.id)}
                      >
                        <div className="address-radio">
                          {selectedAddressId === address.id && !showNewAddressForm && <CheckIcon />}
                        </div>
                        <div className="address-content">
                          <span className="address-name">{address.name}</span>
                          <span className="address-text">
                            {address.street}, {address.city}, {address.state} - {address.pincode}
                          </span>
                          {address.phone && (
                            <span className="address-phone">📞 {address.phone}</span>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Add New Address Option */}
                    <div
                      className={`address-card new-address ${showNewAddressForm ? 'selected' : ''}`}
                      onClick={handleNewAddressClick}
                    >
                      <div className="address-radio">
                        {showNewAddressForm && <CheckIcon />}
                      </div>
                      <div className="address-content">
                        <span className="address-name">+ Add New Address</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show "Add New Address" button when no saved addresses */}
                {savedAddresses.length === 0 && !showNewAddressForm && (
                  <div className="no-addresses">
                    <p>No saved addresses found</p>
                    <button
                      type="button"
                      className="add-address-btn"
                      onClick={handleNewAddressClick}
                    >
                      + Add Delivery Address
                    </button>
                  </div>
                )}

                {/* New Address Form */}
                {showNewAddressForm && (
                  <div className="new-address-form">
                    <div className="form-group">
                      <label htmlFor="street">Street Address *</label>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        placeholder="123 Main Street, Apartment 4B"
                        disabled={loading}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="city">City *</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Mumbai"
                          disabled={loading}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="state">State *</label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="Maharashtra"
                          disabled={loading}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="pincode">Pincode *</label>
                        <input
                          type="text"
                          id="pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          placeholder="400001"
                          maxLength={6}
                          disabled={loading || savingAddress}
                        />
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      className="save-address-btn"
                      onClick={handleSaveAddress}
                      disabled={savingAddress || loading}
                    >
                      {savingAddress ? (
                        <>
                          <span className="btn-spinner small"></span>
                          Saving...
                        </>
                      ) : (
                        '+ Save This Address'
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="form-section">
            <h3>Payment Method</h3>
            <div className="payment-options">
              <label className={`payment-option ${formData.orderType === 'cod' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="orderType"
                  value="cod"
                  checked={formData.orderType === 'cod'}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <span className="payment-label">
                  <span className="payment-icon">💵</span>
                  Cash on Delivery
                </span>
              </label>
              <label className={`payment-option ${formData.orderType === 'online' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="orderType"
                  value="online"
                  checked={formData.orderType === 'online'}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <span className="payment-label">
                  <span className="payment-icon">💳</span>
                  Online Payment
                </span>
              </label>
            </div>
          </div>

          <div className="checkout-summary">
            <div className="summary-row">
              <span>Order Total</span>
              <span className="total-amount">₹{cartTotal.toLocaleString()}</span>
            </div>
          </div>

          <button 
            type="submit" 
            className="place-order-btn"
            disabled={loading || loadingAddresses}
          >
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Placing Order...
              </>
            ) : (
              `Place Order • ₹${cartTotal.toLocaleString()}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
