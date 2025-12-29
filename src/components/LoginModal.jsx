import { useState, useEffect } from 'react';
import ShopsQuery from 'shops-query';
import '../styles/components/LoginModal.css';

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({ email: '', password: '', name: '' });
      setError('');
      setIsSignUp(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isSignUp) {
        // TODO: Implement signup logic
        console.log('Sign Up', formData);
        onClose();
      } else {
        // Login using shops-query loginUser
        const response = await ShopsQuery.login.loginUser(formData.email, formData.password);
        console.log('Login response:', response);
        
        if (response) {
          if (onLoginSuccess) {
            onLoginSuccess(response);
          }
          onClose();
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ email: '', password: '', name: '' });
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <CloseIcon />
        </button>
        
        <div className="modal-header">
          <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p>{isSignUp ? 'Sign up to get started' : 'Login to your account'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Login')}
          </button>
        </form>

        <div className="modal-footer">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button type="button" className="toggle-mode-btn" onClick={toggleMode}>
              {isSignUp ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
