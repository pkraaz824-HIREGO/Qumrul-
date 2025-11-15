import React from 'react';
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gradient-gold py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-3 md:mb-4">Returns & Refunds</h1>
          <p className="text-gray-700 text-base md:text-lg max-w-2xl mx-auto">
            Your satisfaction is our priority. Easy returns within 30 days.
          </p>
        </div>

        <div className="premium-card rounded-xl p-6 md:p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <RefreshCw className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">30-Day Return Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We offer a hassle-free 30-day return policy on most items. If you're not completely satisfied with your purchase, 
                you can return it for a full refund or exchange within 30 days of delivery.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="premium-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="text-green-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">Eligible for Return</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Unopened items in original packaging</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Defective or damaged products</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Items with all original tags and accessories</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Products returned within 30 days</span>
              </li>
            </ul>
          </div>

          <div className="premium-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="text-red-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">Not Eligible for Return</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Opened electronics or software</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Items without original packaging</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Products showing signs of use or wear</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Items purchased on final sale</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="premium-card rounded-xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">How to Return an Item</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Initiate Return Request</h4>
                <p className="text-gray-700">Log in to your account and go to "My Orders". Select the item you want to return and click "Request Return".</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Pack the Item</h4>
                <p className="text-gray-700">Carefully pack the item in its original packaging with all accessories and documentation.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Ship the Return</h4>
                <p className="text-gray-700">Use the prepaid return label we'll email you. Drop off the package at any authorized shipping location.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Receive Your Refund</h4>
                <p className="text-gray-700">Once we receive and inspect your return, we'll process your refund within 5-7 business days.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="premium-card rounded-xl p-6 md:p-8 bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Important Notes</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Refunds will be issued to the original payment method</li>
                <li>• Return shipping is free for defective or incorrect items</li>
                <li>• For non-defective returns, a ₹99 return shipping fee will be deducted from your refund</li>
                <li>• Cash on Delivery orders can be cancelled before shipment without any charges</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
