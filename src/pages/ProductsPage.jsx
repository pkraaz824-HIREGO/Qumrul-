import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useProductStore, useCartStore } from '../store';
import { ProductCard } from '../components/ProductCard';
import { mockCategories } from '../data/mockData';

export function ProductsPage() {
  const { products, filteredProducts, filterProducts, searchTerm } = useProductStore();
  const { addItem } = useCartStore();
  const [search, setSearch] = useState(searchTerm);
  const [category, setCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value) => {
    setSearch(value);
    filterProducts(value, category);
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    filterProducts(search, cat);
  };

  const handleAddToCart = (product) => {
    addItem(product, 1);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gold-50/30 py-6 md:py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Premium typography */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gold-800 to-gray-900 mb-3 drop-shadow-sm">
            Luxury Collection
          </h1>
          <p className="text-sm md:text-base text-gray-600 font-medium">Discover our premium selection of {filteredProducts.length} curated products</p>
        </div>

        {/* Search Bar - Premium glass morphism */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-4 md:p-6 mb-6 md:mb-8 border border-white/50">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500" size={20} />
              <input
                type="text"
                placeholder="Search luxury products..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 md:py-4 border-2 border-gold-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent text-sm md:text-base font-medium bg-white/50 backdrop-blur-sm transition-all duration-300"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-3 md:py-4 bg-gradient-to-r from-gold-500 via-gold-600 to-gold-500 text-white rounded-xl hover:from-gold-600 hover:via-gold-700 hover:to-gold-600 transition-all duration-300 sm:hidden font-bold shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Filter size={20} />
              Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Sidebar Filters - Premium design */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-5 md:p-6 border border-white/50 sticky top-20">
              <h3 className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gold-800 mb-4">Categories</h3>
              <div className="space-y-2">
                {mockCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategory(cat.slug)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-300 text-sm md:text-base font-semibold ${
                      category === cat.slug
                        ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg scale-105'
                        : 'bg-gradient-to-r from-gray-50 to-white text-gray-800 hover:from-gold-50 hover:to-gold-100 hover:scale-102 shadow-md'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Price Filter - Premium */}
              <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t-2 border-gradient-to-r from-transparent via-gold-200 to-transparent">
                <h4 className="font-black text-gray-900 mb-3 md:mb-4 text-sm md:text-base">Price Range</h4>
                <div className="space-y-2.5">
                  <label className="flex items-center group cursor-pointer">
                    <input type="radio" className="w-4 h-4 text-gold-500 focus:ring-gold-500" defaultChecked />
                    <span className="ml-3 text-gray-700 text-sm md:text-base font-medium group-hover:text-gold-700 transition-colors">All Prices</span>
                  </label>
                  <label className="flex items-center group cursor-pointer">
                    <input type="radio" className="w-4 h-4 text-gold-500 focus:ring-gold-500" />
                    <span className="ml-3 text-gray-700 text-sm md:text-base font-medium group-hover:text-gold-700 transition-colors">₹0 - ₹5,000</span>
                  </label>
                  <label className="flex items-center group cursor-pointer">
                    <input type="radio" className="w-4 h-4 text-gold-500 focus:ring-gold-500" />
                    <span className="ml-3 text-gray-700 text-sm md:text-base font-medium group-hover:text-gold-700 transition-colors">₹5,000 - ₹15,000</span>
                  </label>
                  <label className="flex items-center group cursor-pointer">
                    <input type="radio" className="w-4 h-4 text-gold-500 focus:ring-gold-500" />
                    <span className="ml-3 text-gray-700 text-sm md:text-base font-medium group-hover:text-gold-700 transition-colors">₹15,000+</span>
                  </label>
                </div>
              </div>

              {/* Rating Filter - Premium */}
              <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t-2 border-gradient-to-r from-transparent via-gold-200 to-transparent">
                <h4 className="font-black text-gray-900 mb-3 md:mb-4 text-sm md:text-base">Rating</h4>
                <div className="space-y-2.5">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center group cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-gold-500 focus:ring-gold-500" />
                      <span className="ml-3 text-gray-700 text-sm md:text-base font-medium group-hover:text-gold-700 transition-colors">
                        {rating}+ Stars
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid - Premium layout with proper spacing */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-12 md:p-16 text-center border border-white/50">
                <p className="text-gray-600 text-base md:text-lg font-medium">No products found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
