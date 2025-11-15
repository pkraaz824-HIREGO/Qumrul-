import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store';
import { Lock, CheckCircle } from 'lucide-react';

export function ResetPasswordPage() {
  const { resetPassword } = useAuthStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Get email from localStorage (set during forgot password flow)
    const resetEmail = localStorage.getItem('resetEmail');
    if (resetEmail) {
      setEmail(resetEmail);
    } else {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!email) {
      setError('Invalid reset link');
      return;
    }

    const result = resetPassword(email, password);
    if (result) {
      setSuccess(true);
      localStorage.removeItem('resetEmail');
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } else {
      setError('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-gold py-12 flex items-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gold-100">
          {!success ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                  <Lock className="text-gold-600" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Reset Password</h1>
                  <p className="text-sm text-gray-600">Enter your new password</p>
                </div>
              </div>

              {email && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
                  Resetting password for: <strong>{email}</strong>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition font-semibold mt-6"
                >
                  Reset Password
                </button>
              </form>

              <div className="mt-6 text-center">
                <a href="/login" className="text-sm text-gold-600 hover:text-gold-700 font-semibold">
                  Back to Login
                </a>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
              <p className="text-gray-600 mb-6">
                Your password has been reset successfully.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to login page in 3 seconds...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
