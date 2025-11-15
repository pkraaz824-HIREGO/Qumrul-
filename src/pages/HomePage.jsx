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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
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

     {/* Trust Message Section - 3D Box */}
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="bg-gradient-to-br from-white via-gold-50 to-white rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-gold-200 transform hover:scale-105 transition-all duration-300 relative">
          {/* 3D Effect Layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold-100 to-transparent rounded-3xl transform translate-x-2 translate-y-2 -z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-transparent rounded-3xl transform translate-x-4 translate-y-4 -z-20"></div>
          
          <p className="text-lg md:text-xl text-gray-800 leading-relaxed text-center font-medium">
            "Every refurbished laptop we sell is checked like we're buying it for our own family – carefully tested, honestly described, and backed by real support after sale. No hidden problems, no fake promises… just a reliable laptop you can trust, at a price that feels right."
          </p>
        </div>
      </section>
    </div>
  );
}
