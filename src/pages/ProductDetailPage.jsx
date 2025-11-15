import React, { useState } from 'react';
import { useProductStore, useCartStore } from '../store';
import { Star, ShoppingCart, Heart, Truck, Shield, ArrowLeft, Check, RefreshCw, Award } from 'lucide-react';

export function ProductDetailPage({ productId }) {
  const { getProductById } = useProductStore();
  const { addItem } = useCartStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = getProductById(parseInt(productId));

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-gold py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-md p-12 border border-gold-100">
            <p className="text-gray-600 text-lg mb-6">Product not found</p>
            <a href="/products" className="inline-block px-8 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition font-semibold">
              Back to Products
            </a>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image];
  const discount = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem({ ...product, quantity });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    addItem({ ...product, quantity });
    sessionStorage.setItem('buyNowProduct', JSON.stringify({
      ...product,
      quantity
    }));
    window.location.href = '/cart?buyNow=true';
  };

  return (
    <div className="min-h-screen bg-gradient-gold py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <a href="/products" className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 mb-4 md:mb-6 font-semibold">
          <ArrowLeft size={20} />
          Back to Products
        </a>

        {/* Product Detail Grid - Optimized for all screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 bg-white rounded-2xl shadow-lg p-4 md:p-6 lg:p-8 border border-gold-100">
          
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gold-200">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-gradient-to-br from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  -{discount}%
                </div>
              )}
              {product.featured && (
                <div className="absolute top-4 left-4 bg-gold-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  FEATURED
                </div>
              )}
              {product.isRefurbished && (
                <div className="absolute bottom-4 left-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                  <RefreshCw size={18} />
                  CERTIFIED REFURBISHED
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === idx
                        ? 'border-gold-500 ring-2 ring-gold-300'
                        : 'border-gray-200 hover:border-gold-300'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info - Compact on Desktop */}
          <div className="flex flex-col justify-between space-y-4 lg:space-y-3">
            
            {/* Product Header */}
            <div>
              {/* Category & Brand */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs md:text-sm text-gold-600 font-bold uppercase tracking-wider">
                  {product.category}
                </span>
                {product.brand && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-xs md:text-sm text-gray-600 font-semibold">{product.brand}</span>
                  </>
                )}
              </div>

              {/* Product Name */}
              <h1 className="text-2xl md:text-3xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-3 lg:mb-2 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4 lg:mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.floor(product.rating) ? 'fill-gold-500 text-gold-500' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4 lg:mb-3">
                <span className="text-3xl md:text-4xl lg:text-3xl font-bold gradient-text">₹{product.price.toFixed(2)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-lg md:text-xl text-gray-400 line-through">₹{product.originalPrice.toFixed(2)}</span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-4 lg:mb-3">
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                <p className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
              </div>

              {/* Refurbished Condition Badge */}
              {product.isRefurbished && product.condition && (
                <div className="mb-4 lg:mb-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Award className="text-blue-600" size={18} />
                    <div>
                      <p className="text-sm font-bold text-blue-900">Condition: {product.condition}</p>
                      <p className="text-xs text-blue-700">Certified Refurbished with Warranty</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="border-t border-gray-200 pt-4 lg:pt-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center gap-3 mb-4 lg:mb-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border-2 border-gold-300 rounded-lg hover:bg-gold-50 transition font-bold text-gray-700"
                >
                  -
                </button>
                <span className="text-lg font-bold text-gray-800 min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 border-2 border-gold-300 rounded-lg hover:bg-gold-50 transition font-bold text-gray-700"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-4 lg:mb-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="px-4 md:px-6 py-3 bg-white border-2 border-gold-500 text-gold-600 rounded-lg hover:bg-gold-50 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {addedToCart ? (
                    <>
                      <Check size={20} />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="px-4 md:px-6 py-3 btn-premium text-white rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>

              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold flex items-center justify-center gap-2">
                <Heart size={20} />
                Add to Wishlist
              </button>
            </div>

            {/* Features - Compact */}
            <div className="grid grid-cols-2 gap-3 pt-4 lg:pt-3 border-t border-gray-200">
              <div className="flex items-start gap-2">
                <Truck className="text-gold-600 flex-shrink-0" size={20} />
                <div>
                  <p className="text-xs font-bold text-gray-800">Free Shipping</p>
                  <p className="text-xs text-gray-600">On orders over ₹1000</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="text-gold-600 flex-shrink-0" size={20} />
                <div>
                  <p className="text-xs font-bold text-gray-800">Secure Payment</p>
                  <p className="text-xs text-gray-600">100% Protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Product Description Section */}
        <div className="mt-6 lg:mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8 lg:p-10 border border-gold-100">
          <div className="max-w-4xl">
            {/* Section Header */}
            <div className="border-b-2 border-gold-200 pb-4 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 gradient-text">
                Product Description
              </h2>
            </div>

            {/* Description Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-base md:text-lg text-gray-700 leading-relaxed md:leading-loose mb-6">
                {product.description}
              </p>

              {/* Additional Description Details (if available) */}
              <div className="mt-8 space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 bg-gradient-to-br from-gold-50 to-white p-4 rounded-lg border border-gold-100">
                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Premium Quality</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Built with high-quality materials ensuring durability and long-lasting performance.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-gradient-to-br from-gold-50 to-white p-4 rounded-lg border border-gold-100">
                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Latest Technology</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Incorporates cutting-edge technology for superior performance and efficiency.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-gradient-to-br from-gold-50 to-white p-4 rounded-lg border border-gold-100">
                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Warranty Included</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Comes with comprehensive warranty coverage for your peace of mind.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-gradient-to-br from-gold-50 to-white p-4 rounded-lg border border-gold-100">
                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Easy Returns</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Hassle-free return policy within 30 days of purchase if not satisfied.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What's in the Box */}
              <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">What's in the Box</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3 text-gray-700">
                    <Check className="text-green-600 flex-shrink-0" size={20} />
                    <span>1x {product.name}</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <Check className="text-green-600 flex-shrink-0" size={20} />
                    <span>User Manual & Documentation</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <Check className="text-green-600 flex-shrink-0" size={20} />
                    <span>Warranty Card</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <Check className="text-green-600 flex-shrink-0" size={20} />
                    <span>Original Packaging</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs - Below description */}
        <div className="mt-6 lg:mt-8 bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gold-100">
          <div className="border-b border-gray-200 mb-4">
            <h2 className="text-xl font-bold text-gray-900 pb-4">Product Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {product.brand && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Brand</span>
                <span className="text-gray-600">{product.brand}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-semibold text-gray-700">Category</span>
              <span className="text-gray-600">{product.category}</span>
            </div>
            {product.subcategory && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Subcategory</span>
                <span className="text-gray-600">{product.subcategory}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-semibold text-gray-700">SKU</span>
              <span className="text-gray-600">{product.sku}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
