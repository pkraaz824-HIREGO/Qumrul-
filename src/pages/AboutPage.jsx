import React from 'react';
import { Award, Users, Target, Heart } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-gold py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-3 md:mb-4">About Elite Store</h1>
          <p className="text-gray-700 text-base md:text-lg max-w-3xl mx-auto">
            Your trusted destination for premium electronics, fashion, and lifestyle products since 2020.
          </p>
        </div>

        <div className="premium-card rounded-xl p-6 md:p-10 mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Our Story</h2>
          <p className="text-gray-700 leading-relaxed mb-4 text-sm md:text-base">
            Elite Store was founded with a simple mission: to provide customers with access to the finest products 
            from around the world, all in one convenient location. What started as a small online shop has grown into 
            a trusted e-commerce platform serving thousands of satisfied customers globally.
          </p>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            We carefully curate our product selection to ensure every item meets our high standards of quality, 
            functionality, and design. From cutting-edge electronics to timeless fashion pieces, we're committed 
            to offering products that enhance your lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 md:mb-12">
          <div className="premium-card rounded-xl p-6 text-center">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Award className="text-white" size={28} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Premium Quality</h3>
            <p className="text-gray-600 text-sm md:text-base">100% authentic products from authorized brands</p>
          </div>

          <div className="premium-card rounded-xl p-6 text-center">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="text-white" size={28} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">50,000+ Customers</h3>
            <p className="text-gray-600 text-sm md:text-base">Trusted by customers worldwide</p>
          </div>

          <div className="premium-card rounded-xl p-6 text-center">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="text-white" size={28} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600 text-sm md:text-base">Quick and reliable shipping globally</p>
          </div>

          <div className="premium-card rounded-xl p-6 text-center">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="text-white" size={28} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-sm md:text-base">Dedicated customer service team</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="premium-card rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              To revolutionize online shopping by providing an exceptional customer experience, offering premium 
              products at competitive prices, and building lasting relationships with our customers through trust, 
              transparency, and outstanding service.
            </p>
          </div>

          <div className="premium-card rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
            <ul className="space-y-2 text-gray-700 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">✓</span>
                <span>Customer satisfaction is our top priority</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">✓</span>
                <span>Quality and authenticity guaranteed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">✓</span>
                <span>Ethical business practices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">✓</span>
                <span>Continuous innovation and improvement</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="premium-card rounded-xl p-6 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Join Our Community</h2>
          <p className="text-gray-700 leading-relaxed mb-6 md:mb-8 max-w-3xl mx-auto text-sm md:text-base">
            Become part of the Elite Store family and enjoy exclusive deals, early access to new products, 
            and premium customer service. Start shopping today and experience the difference.
          </p>
          <a
            href="/products"
            className="inline-block px-6 md:px-10 py-3 md:py-4 btn-premium text-white rounded-lg hover:shadow-xl transition font-semibold text-sm md:text-base"
          >
            Start Shopping
          </a>
        </div>
      </div>
    </div>
  );
}
