import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gold-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center text-white font-bold">
                E
              </div>
              <span className="text-xl font-bold">Elite Store</span>
            </div>
            <p className="text-gray-400 text-sm">Premium products for modern living.</p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold text-gold-500 mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/products" className="hover:text-gold-500 transition">All Products</a></li>
              <li><a href="/products?category=Laptops" className="hover:text-gold-500 transition">Laptops</a></li>
              <li><a href="/products?category=Mobile Phones" className="hover:text-gold-500 transition">Mobile Phones</a></li>
              <li><a href="/products?category=Accessories" className="hover:text-gold-500 transition">Accessories</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-gold-500 mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/contact" className="hover:text-gold-500 transition">Contact Us</a></li>
              <li><a href="/shipping" className="hover:text-gold-500 transition">Shipping Info</a></li>
              <li><a href="/returns" className="hover:text-gold-500 transition">Returns</a></li>
              <li><a href="/faq" className="hover:text-gold-500 transition">FAQ</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-gold-500 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/about" className="hover:text-gold-500 transition">About Us</a></li>
              <li><a href="/privacy" className="hover:text-gold-500 transition">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-gold-500 transition">Terms of Service</a></li>
              <li><a href="/careers" className="hover:text-gold-500 transition">Careers</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Elite Store. All rights reserved. | Designed with elegance and minimal aesthetics</p>
        </div>
      </div>
    </footer>
  );
}
