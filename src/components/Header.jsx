import React from 'react';
import { ShoppingCart, Menu, X, LogOut, LogIn, BarChart3 } from 'lucide-react';
import { useAuthStore, useCartStore } from '../store';

export function Header({ onMenuClick, isMenuOpen }) {
  const { user, logout, isLoggedIn } = useAuthStore();
  const cartItems = useCartStore(state => state.items);

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gold-200/50 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center group">
              <img 
                src={localStorage.getItem('siteLogo') || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop'}
                alt="LAP Ultra"
                className="h-12 object-contain group-hover:scale-105 transition-transform"
                style={{ width: 'auto', maxWidth: '200px' }}
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-700 hover:text-gold-600 transition font-medium relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-500 to-gold-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="/products" className="text-gray-700 hover:text-gold-600 transition font-medium relative group">
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-500 to-gold-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            {isLoggedIn && (
              <a href="/my-orders" className="text-gray-700 hover:text-gold-600 transition font-medium relative group">
                My Orders
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-500 to-gold-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            )}
            {isLoggedIn && user?.isAdmin && (
              <a href="/admin" className="flex items-center gap-1 text-gray-700 hover:text-gold-600 transition font-medium relative group">
                <BarChart3 size={18} />
                Admin
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-500 to-gold-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            {/* Cart */}
            <a href="/cart" className="relative flex items-center group">
              <div className="relative">
                <ShoppingCart size={26} className="text-gold-600 group-hover:text-gold-700 transition" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    {cartItems.length}
                  </span>
                )}
              </div>
            </a>

            {/* Auth */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-gold-50 px-4 py-2 rounded-full cursor-pointer hover:bg-gold-100 transition" onClick={() => window.location.href = '/profile'}>
                  <div className="w-8 h-8 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user?.firstName?.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{user?.firstName}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    window.location.href = '/';
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-full transition text-sm font-medium border border-red-200 hover:border-red-300"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <a href="/login" className="flex items-center gap-2 px-6 py-3 btn-premium text-white rounded-full hover:shadow-xl transition text-sm font-semibold">
                <LogIn size={18} />
                <span className="hidden sm:inline">Login</span>
              </a>
            )}

            {/* Mobile Menu Button */}
            <button onClick={onMenuClick} className="md:hidden p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-gold-200 py-4 space-y-2">
            <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gold-50 rounded">Home</a>
            <a href="/products" className="block px-4 py-2 text-gray-700 hover:bg-gold-50 rounded">Shop</a>
            {isLoggedIn && (
              <>
                <a href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gold-50 rounded">My Profile</a>
                <a href="/my-orders" className="block px-4 py-2 text-gray-700 hover:bg-gold-50 rounded">My Orders</a>
              </>
            )}
            {isLoggedIn && user?.isAdmin && (
              <a href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gold-50 rounded">Admin</a>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
