import React from 'react';
import { Truck, Package, Globe, Clock } from 'lucide-react';

export function ShippingInfoPage() {
  return (
    <div className="min-h-screen bg-gradient-gold py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-3 md:mb-4">Shipping Information</h1>
          <p className="text-gray-700 text-base md:text-lg max-w-2xl mx-auto">
            Fast, reliable, and secure delivery to your doorstep
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 md:mb-12">
          <div className="premium-card rounded-xl p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center mb-4">
              <Truck className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Free Shipping</h3>
            <p className="text-gray-600 leading-relaxed">
              Enjoy complimentary shipping on all orders over ₹1000. No minimum order required for premium members.
            </p>
          </div>

          <div className="premium-card rounded-xl p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center mb-4">
              <Clock className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Delivery</h3>
            <p className="text-gray-600 leading-relaxed">
              Standard delivery within 3-5 business days. Express options available for next-day delivery.
            </p>
          </div>

          <div className="premium-card rounded-xl p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center mb-4">
              <Package className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Packaging</h3>
            <p className="text-gray-600 leading-relaxed">
              Premium packaging with bubble wrap and protective materials to ensure your items arrive in perfect condition.
            </p>
          </div>

          <div className="premium-card rounded-xl p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center mb-4">
              <Globe className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Worldwide Shipping</h3>
            <p className="text-gray-600 leading-relaxed">
              We ship globally to over 100 countries. International shipping rates calculated at checkout.
            </p>
          </div>
        </div>

        <div className="premium-card rounded-xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Shipping Rates</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold-200">
                  <th className="text-left py-3 px-4 font-bold text-gray-900">Shipping Method</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-900">Delivery Time</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-900">Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gold-100">
                  <td className="py-3 px-4 text-gray-700">Standard Shipping</td>
                  <td className="py-3 px-4 text-gray-700">3-5 Business Days</td>
                  <td className="py-3 px-4 text-gray-700">₹99 (Free over ₹1000)</td>
                </tr>
                <tr className="border-b border-gold-100">
                  <td className="py-3 px-4 text-gray-700">Express Shipping</td>
                  <td className="py-3 px-4 text-gray-700">1-2 Business Days</td>
                  <td className="py-3 px-4 text-gray-700">₹299</td>
                </tr>
                <tr className="border-b border-gold-100">
                  <td className="py-3 px-4 text-gray-700">Next Day Delivery</td>
                  <td className="py-3 px-4 text-gray-700">1 Business Day</td>
                  <td className="py-3 px-4 text-gray-700">₹499</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700">International Shipping</td>
                  <td className="py-3 px-4 text-gray-700">7-14 Business Days</td>
                  <td className="py-3 px-4 text-gray-700">Varies by location</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="premium-card rounded-xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Order Tracking</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Once your order ships, you'll receive a tracking number via email. You can track your package in real-time through our website or the carrier's tracking portal.
          </p>
          <p className="text-gray-700 leading-relaxed">
            For any shipping inquiries, please contact our customer support team at support@elitestore.com or visit our Contact Us page.
          </p>
        </div>
      </div>
    </div>
  );
}
