import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBannerStore } from '../store';

export function BannerCarousel() {
  const { banners } = useBannerStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
        <p className="text-gray-600 text-lg font-semibold">No banners available</p>
      </div>
    );
  }

  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);
  const currentBanner = sortedBanners[currentIndex];

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
      {/* Banner Images */}
      <div className="relative w-full h-full">
        {sortedBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              index === currentIndex
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
            
            {/* Banner Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="max-w-2xl">
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 drop-shadow-2xl animate-fadeInUp">
                    {banner.title}
                  </h2>
                  <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-6 md:mb-8 drop-shadow-lg animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    {banner.subtitle}
                  </p>
                  {banner.link && (
                    <a
                      href={banner.link}
                      className="inline-block px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-gold-500 via-gold-600 to-gold-500 text-white font-bold text-sm md:text-base rounded-xl hover:from-gold-600 hover:via-gold-700 hover:to-gold-600 transition-all duration-300 shadow-2xl hover:shadow-gold-500/50 hover:scale-105 animate-fadeInUp"
                      style={{ animationDelay: '0.4s' }}
                    >
                      Shop Now
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {sortedBanners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-2 md:p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-xl"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} className="md:w-8 md:h-8" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-2 md:p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-xl"
            aria-label="Next slide"
          >
            <ChevronRight size={24} className="md:w-8 md:h-8" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {sortedBanners.length > 1 && (
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3">
          {sortedBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 md:w-12 h-2 md:h-3 bg-white shadow-lg'
                  : 'w-2 md:w-3 h-2 md:h-3 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Banner Counter */}
      {sortedBanners.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold">
          {currentIndex + 1} / {sortedBanners.length}
        </div>
      )}
    </div>
  );
}
