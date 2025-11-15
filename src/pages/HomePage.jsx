import React from 'react';
import { ArrowRight, Truck, Shield, Headphones } from 'lucide-react';
import { useProductStore, useCartStore } from '../store';
import { ProductCard } from '../components/ProductCard';
import { BannerCarousel } from '../components/BannerCarousel';

export function HomePage() {
  const { addItem } = useCartStore();
  const { products } = useProductStore();
  const featuredProducts = products.filter(p => p.featured).slice(0, 6);

  const handleAddToCart = (product) => {
    addItem(product, 1);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gradient-gold">
      {/* Hero Section with Banner Carousel - Reduced spacing */}
      <section className="relative pt-4 sm:pt-6 pb-6 sm:pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <BannerCarousel />
        </div>
      </section>

      {/* Features Section - Reduced spacing */}
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="premium-card rounded-2xl p-6 md:p-8 text-center group hover:scale-105 transition-transform duration-300">
          <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
            <Truck size={28} className="md:w-8 md:h-8 text-white" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Free Shipping</h3>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">Complimentary delivery on all orders over ₹1000. Fast and secure shipping worldwide.</p>
        </div>
        
        <div className="premium-card rounded-2xl p-6 md:p-8 text-center group hover:scale-105 transition-transform duration-300">
          <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
            <Shield size={28} className="md:w-8 md:h-8 text-white" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Secure Payment</h3>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">100% secure transactions with industry-leading encryption and fraud protection.</p>
        </div>
        
        <div className="premium-card rounded-2xl p-6 md:p-8 text-center group hover:scale-105 transition-transform duration-300">
          <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
            <Headphones size={28} className="md:w-8 md:h-8 text-white" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">24/7 Support</h3>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">Dedicated customer service team ready to assist you anytime, anywhere.</p>
        </div>
      </section>

      {/* Featured Products - Reduced spacing */}
      <section id="featured" className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block mb-3 md:mb-4 px-4 md:px-6 py-1.5 md:py-2 bg-gold-100 rounded-full">
            <span className="text-xs md:text-sm font-bold gradient-text uppercase tracking-wider">Curated Selection</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-6">Featured Products</h2>
          <p className="text-gray-700 text-base md:text-xl max-w-2xl mx-auto">Handpicked premium devices and accessories for the discerning customer</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <a
            href="/products"
            className="inline-flex items-center gap-2 md:gap-3 px-6 md:px-10 py-3 md:py-5 border-2 border-gold-500 text-gray-800 rounded-full hover:bg-gold-50 hover:shadow-xl transition font-bold text-base md:text-lg group"
          >
            View All Products
            <ArrowRight size={20} className="md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* CTA Section - Reduced spacing */}
      <section className="bg-gray-900 text-white py-10 md:py-12 my-8 md:my-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Ready to Shop?</h2>
          <p className="text-gray-300 text-base md:text-lg mb-6 md:mb-8">Enjoy premium quality with our exclusive collection</p>
          <a
            href="/products"
            className="inline-block px-6 md:px-8 py-3 md:py-4 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition font-semibold text-sm md:text-base"
          >
            Start Shopping Now
          </a>
        </div>
      </section>
    </div>
  );
}
