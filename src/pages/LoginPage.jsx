import React, { useState } from 'react';
import { useAuthStore } from '../store';
import { Mail } from 'lucide-react';

export function LoginPage() {
  const { login, register } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setError('Please enter your email address');
      return;
    }
    
    // In real app, this would call API to send reset email
    // For demo, we'll save email and redirect to reset page
    localStorage.setItem('resetEmail', resetEmail);
    setResetSent(true);
    setTimeout(() => {
      window.location.href = '/reset-password';
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isRegister) {
      if (!formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.phone) {
        setError('All fields are required');
        return;
      }
      
      // Validate phone number (10 digits)
      if (!/^\d{10}$/.test(formData.phone)) {
        setError('Please enter a valid 10-digit mobile number');
        return;
      }
      const success = register(formData.email, formData.firstName, formData.lastName, formData.password, formData.phone);
      if (success) {
        window.location.href = '/';
      } else {
        setError('Email already exists');
      }
    } else {
      if (!formData.email || !formData.password) {
        setError('Email and password are required');
        return;
      }
      const success = login(formData.email, formData.password);
      if (success) {
        window.location.href = '/';
      } else {
        setError('Invalid email or password');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-gold py-12 flex items-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gold-100">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600 text-center mb-8">
            {isRegister ? 'Sign up to get started' : 'Sign in to your account'}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Mobile Number (10 digits)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  maxLength="10"
                  pattern="[0-9]{10}"
                  className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
            />

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition font-semibold mt-6"
            >
              {isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {!isRegister && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-gold-600 hover:text-gold-700 font-semibold"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isRegister ? 'Already have an account? ' : "Don't have an account? "}
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setFormData({ email: '', password: '', firstName: '', lastName: '', phone: '' });
                  setError('');
                }}
                className="text-gold-600 hover:text-gold-700 font-semibold"
              >
                {isRegister ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-gold-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Demo Accounts:</h3>
            <div className="space-y-2 text-xs text-gray-600">
              <p><strong>User:</strong> john@example.com / password123</p>
              <p><strong>Admin:</strong> admin@example.com / admin123</p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            {!resetSent ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                    <Mail className="text-gold-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Reset Password</h3>
                    <p className="text-sm text-gray-600">We'll send you a reset link</p>
                  </div>
                </div>

                <form onSubmit={handleForgotPassword}>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetEmail('');
                        setError('');
                      }}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition font-semibold"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="text-green-600" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h3>
                  <p className="text-gray-600 mb-6">
                    We've sent a password reset link to <strong>{resetEmail}</strong>
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Click the link in the email to reset your password. The link will expire in 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetSent(false);
                      setResetEmail('');
                    }}
                    className="px-6 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition font-semibold"
                  >
                    Got It
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
