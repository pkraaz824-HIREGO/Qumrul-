import React, { useState } from 'react';
import { useAuthStore } from '../store';

export function LoginPage() {
  const { login, register } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isRegister) {
      if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
        setError('All fields are required');
        return;
      }
      const success = register(formData.email, formData.firstName, formData.lastName, formData.password);
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

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isRegister ? 'Already have an account? ' : "Don't have an account? "}
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setFormData({ email: '', password: '', firstName: '', lastName: '' });
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
    </div>
  );
}
