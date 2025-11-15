import React, { useState } from 'react';
import { Star, ShoppingCart, Eye, Heart, RefreshCw } from 'lucide-react';

export function ProductCard({ product, onAddToCart }) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on buttons or interactive elements
    if (e.target.closest('button')) {
      return;
    }
    window.history.pushState({}, '', `/product/${product.id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleBuyNow = () => {
    // Store the product for direct checkout
    sessionStorage.setItem('buyNowProduct', JSON.stringify({
      ...product,
      quantity: 1
    }));
    window.location.href = '/cart?buyNow=true';
  };

  return (
    <div 
      onClick={handleCardClick}
      className="premium-card rounded-xl overflow-hidden group relative animate-fadeInUp shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gold-300 transform hover:-translate-y-1 cursor-pointer w-full max-w-sm mx-auto"
    >
      {/* Image Container - Premium with gradient overlay */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 h-32 md:h-36 lg:h-40">
        <div className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          {/* Premium gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        
        {/* Discount Badge - Premium gradient */}
        {discount > 0 && (
          <div className="absolute top-1.5 md:top-2 right-1.5 md:right-2 bg-gradient-to-br from-red-500 via-red-600 to-pink-600 text-white px-2 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold shadow-xl animate-pulse">
            -{discount}%
          </div>
        )}
        
        {/* Brand Badge - Luxury glass effect */}
        {product.brand && (
          <div className="absolute top-1.5 md:top-2 left-1.5 md:left-2 bg-white/95 backdrop-blur-md px-2 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold text-gray-800 shadow-lg border border-white/50">
            {product.brand}
          </div>
        )}

        {/* Refurbished Badge - Premium blue gradient */}
        {product.isRefurbished && (
          <div className="absolute bottom-1.5 md:bottom-2 left-1.5 md:left-2 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold shadow-xl flex items-center gap-0.5 md:gap-1">
            <RefreshCw size={10} className="md:w-3 md:h-3 animate-spin-slow" />
            REFURB
          </div>
        )}

        {/* Quick Actions - Premium glass morphism */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-1.5 md:gap-2 z-10">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              window.history.pushState({}, '', `/product/${product.id}`);
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="bg-white/95 backdrop-blur-xl p-1.5 md:p-2 rounded-full shadow-2xl hover:bg-gold-500 hover:text-white transition-all duration-300 hover:scale-110 border border-white/50"
          >
            <Eye size={14} className="md:w-4 md:h-4" />
          </button>
          <button 
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 backdrop-blur-xl p-1.5 md:p-2 rounded-full shadow-2xl hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110 border border-white/50"
          >
            <Heart size={14} className="md:w-4 md:h-4" />
          </button>
        </div>

        {/* Add to Cart Button - Premium gradient */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-gold-500 via-gold-600 to-gold-500 text-white py-1.5 md:py-2 transform translate-y-full group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-1 md:gap-1.5 font-bold text-[10px] md:text-xs shadow-2xl hover:shadow-gold-500/50 z-10"
        >
          <ShoppingCart size={12} className="md:w-4 md:h-4" />
          Add to Cart
        </button>
      </div>

      {/* Content - Premium spacing and typography */}
      <div className="p-2.5 md:p-3 lg:p-4 bg-gradient-to-b from-white to-gray-50">
        {/* Category & Subcategory - Premium typography */}
        <div className="flex items-center gap-1 md:gap-1.5 mb-1 md:mb-1.5">
          <span className="text-[10px] md:text-xs text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-gold-800 font-black uppercase tracking-wider">
            {product.category}
          </span>
          {product.subcategory && (
            <>
              <span className="text-gold-400 text-[8px] md:text-[10px]">•</span>
              <span className="text-[10px] md:text-xs text-gray-600 font-semibold">
                {product.subcategory}
              </span>
            </>
          )}
        </div>

        {/* Product Name - Luxury typography */}
        <h3 className="font-bold text-gray-900 text-xs md:text-sm lg:text-base mb-1.5 md:mb-2 line-clamp-2 min-h-[2rem] md:min-h-[2.5rem] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-gold-600 hover:to-gold-800 transition-all duration-300">
          {product.name}
        </h3>

        {/* Rating - Premium gold stars */}
        <div className="flex items-center gap-1 md:gap-1.5 mb-1.5 md:mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={`md:w-4 md:h-4 transition-all duration-200 ${
                  i < Math.floor(product.rating)
                    ? 'fill-gold-500 text-gold-500 drop-shadow-md'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs md:text-sm font-bold text-gray-900">{product.rating}</span>
          <span className="text-[10px] md:text-xs text-gray-500">({product.reviews})</span>
        </div>

        {/* Description with See More - Premium styling */}
        <div className="mb-2">
          <p className="text-[10px] md:text-xs lg:text-sm text-gray-700 leading-relaxed">
            {showFullDescription ? product.description : `${product.description.substring(0, 50)}...`}
          </p>
          {product.description.length > 50 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFullDescription(!showFullDescription);
              }}
              className="text-[9px] md:text-[10px] lg:text-xs text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-gold-800 hover:from-gold-700 hover:to-gold-900 font-bold mt-0.5 transition-all duration-300"
            >
              {showFullDescription ? 'Show Less' : 'See More'}
            </button>
          )}
        </div>

        {/* Price - Luxury gradient text */}
        <div className="flex items-baseline gap-1.5 md:gap-2 mb-2 md:mb-2.5">
          <span className="text-lg md:text-xl lg:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-700 to-gold-600 drop-shadow-sm">
            ₹{product.price.toFixed(2)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-[10px] md:text-xs lg:text-sm text-gray-400 line-through font-medium">
              ₹{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Status & Actions - Premium design */}
        <div className="pt-2 md:pt-2.5 border-t-2 border-gradient-to-r from-transparent via-gold-200 to-transparent">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 md:gap-1.5">
              <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'} animate-pulse shadow-lg`}></div>
              <p className={`text-[10px] md:text-xs lg:text-sm font-bold ${product.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>
            </div>
            {product.featured && (
              <span className="text-[8px] md:text-[9px] lg:text-[10px] bg-gradient-to-r from-gold-100 to-gold-200 text-gold-800 px-1.5 md:px-2 py-0.5 rounded-full font-black uppercase tracking-wide shadow-md">Featured</span>
            )}
          </div>
          
          {/* Action Buttons - Premium gradient buttons */}
          <div className="grid grid-cols-2 gap-1.5 md:gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              disabled={product.stock === 0}
              className="px-2 md:px-3 py-1.5 md:py-2 bg-white border-2 border-gold-500 text-gold-700 rounded-lg hover:bg-gradient-to-r hover:from-gold-50 hover:to-gold-100 transition-all duration-300 font-bold text-[10px] md:text-xs lg:text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 shadow-md hover:shadow-lg hover:scale-105"
            >
              <ShoppingCart size={12} className="md:w-4 md:h-4" />
              Add
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBuyNow();
              }}
              disabled={product.stock === 0}
              className="px-2 md:px-3 py-1.5 md:py-2 bg-gradient-to-r from-gold-500 via-gold-600 to-gold-500 text-white rounded-lg hover:from-gold-600 hover:via-gold-700 hover:to-gold-600 transition-all duration-300 font-bold text-[10px] md:text-xs lg:text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
