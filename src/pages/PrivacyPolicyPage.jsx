import React from 'react';
import { Shield, Lock, Eye, Database } from 'lucide-react';

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-gold py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-3 md:mb-4">Privacy Policy</h1>
          <p className="text-gray-700 text-base md:text-lg max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your data.
          </p>
          <p className="text-gray-600 text-sm mt-2">Last Updated: November 15, 2024</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 md:mb-12">
          <div className="premium-card rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Shield className="text-white" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Secure</h3>
            <p className="text-gray-600 text-xs mt-1">Data Protection</p>
          </div>

          <div className="premium-card rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Lock className="text-white" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Encrypted</h3>
            <p className="text-gray-600 text-xs mt-1">SSL Security</p>
          </div>

          <div className="premium-card rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Eye className="text-white" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Transparent</h3>
            <p className="text-gray-600 text-xs mt-1">Clear Policies</p>
          </div>

          <div className="premium-card rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Database className="text-white" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Confidential</h3>
            <p className="text-gray-600 text-xs mt-1">Never Shared</p>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="premium-card rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            <div className="space-y-3 text-gray-700 text-sm md:text-base">
              <p className="leading-relaxed">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-gold-600 mt-1">•</span>
                  <span>Personal information (name, email, phone number, shipping address)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-600 mt-1">•</span>
                  <span>Payment information (processed securely through our payment partners)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-600 mt-1">•</span>
                  <span>Order history and purchase preferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-600 mt-1">•</span>
                  <span>Communication preferences and customer service interactions</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="premium-card rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <div className="space-y-3 text-gray-700 text-sm md:text-base">
              <p className="leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-gold-600 mt-1">•</span>
                  <span>Process and fulfill your orders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-600 mt-1">•</span>
                  <span>Send order confirmations and shipping updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-600 mt-1">•</span>
                  <span>Provide customer support and respond to your inquiries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-600 mt-1">•</span>
                  <span>Improve our products, services, and website functionality</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-600 mt-1">•</span>
                  <span>Send promotional emails (with your consent)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="premium-card rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-sm md:text-base">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="space-y-2 ml-6 text-gray-700 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>SSL encryption for all data transmission</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>PCI-DSS compliant payment processing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Secure servers with regular security audits</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Limited employee access to personal data</span>
              </li>
            </ul>
          </div>

          <div className="premium-card rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-sm md:text-base">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only with:
            </p>
            <ul className="space-y-2 ml-6 text-gray-700 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Shipping carriers to deliver your orders</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Payment processors to complete transactions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Service providers who assist in website operations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Law enforcement when required by law</span>
              </li>
            </ul>
          </div>

          <div className="premium-card rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-sm md:text-base">
              You have the right to:
            </p>
            <ul className="space-y-2 ml-6 text-gray-700 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Access and update your personal information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Request deletion of your account and data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Opt-out of marketing communications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Request a copy of your data</span>
              </li>
            </ul>
          </div>

          <div className="premium-card rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Cookies</h2>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
              You can control cookie preferences through your browser settings. Note that disabling cookies may 
              affect website functionality.
            </p>
          </div>

          <div className="premium-card rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              If you have any questions about this Privacy Policy or how we handle your data, please contact us at:
            </p>
            <p className="text-gray-700 mt-3 text-sm md:text-base">
              Email: <a href="mailto:privacy@elitestore.com" className="text-gold-600 hover:underline">privacy@elitestore.com</a><br />
              Phone: +1 (555) 123-4567
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
