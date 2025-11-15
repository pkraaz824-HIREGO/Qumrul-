import React from 'react';
import { FileText, Scale, AlertCircle } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-gold py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="text-white" size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-3 md:mb-4">Terms of Service</h1>
          <p className="text-gray-700 text-base md:text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using our services.
          </p>
          <p className="text-gray-600 text-sm mt-2">Last Updated: November 15, 2024</p>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="premium-card rounded-xl p-6 md:p-8">
            <div className="flex items-start gap-4 mb-4">
              <Scale className="text-gold-600 flex-shrink-0" size={28} />
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Agreement to Terms</h2>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  By accessing and using Elite Store's website and services, you agree to be bound by these Terms of Service 
                  and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited 
                  from using or accessing this site.
                </p>
              </div>
            </div>
          </div>

          <div className="premium-card rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Use License</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-sm md:text-base">
              Permission is granted to temporarily access the materials on Elite Store's website for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="space-y-2 ml-6 text-gray-700 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Modify or copy the materials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Use the materials for any commercial purpose</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Attempt to reverse engineer any software contained on the website</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Remove any copyright or proprietary notations from the materials</span>
              </li>
            </ul>
          </div>

          <div className="premium-card rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Account Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-sm md:text-base">
              When you create an account with us, you are responsible for:
            </p>
            <ul className="space-y-2 ml-6 text-gray-700 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Maintaining the confidentiality of your account and password</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Providing accurate and complete information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Updating your information to keep it current</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>All activities that occur under your account</span>
              </li>
            </ul>
          </div>

          <div className="premium-card rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Orders and Payments</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-sm md:text-base">
              By placing an order through our website, you agree that:
            </p>
            <ul className="space-y-2 ml-6 text-gray-700 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>All prices are subject to change without notice</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>We reserve the right to refuse or cancel any order</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>Product availability is not guaranteed until payment is confirmed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 mt-1">•</span>
                <span>You are responsible for all charges incurred under your account</span>
              </li>
            </ul>
          </div>

          <div className="premium-card rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Product Information</h2>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              We strive to provide accurate product descriptions and images. However, we do not warrant that product 
              descriptions, colors, or other content are accurate, complete, or error-free. If a product you purchased 
              is not as described, your sole remedy is to return it in unused condition within our return policy timeframe.
            </p>
          </div>

          <div className="premium-card rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              All content on this website, including text, graphics, logos, images, and software, is the property of 
              Elite Store or its content suppliers and is protected by international copyright laws. Unauthorized use 
              of any materials may violate copyright, trademark, and other laws.
            </p>
          </div>

          <div className="premium-card rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              Elite Store shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
              resulting from your use of or inability to use the service, unauthorized access to or alteration of your 
              transmissions or data, or any other matter relating to the service.
            </p>
          </div>

          <div className="premium-card rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which 
              Elite Store operates, without regard to its conflict of law provisions. Any disputes arising from these 
              terms will be resolved in the courts of that jurisdiction.
            </p>
          </div>

          <div className="premium-card rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting 
              to the website. Your continued use of the service after changes constitutes acceptance of the modified terms.
            </p>
          </div>

          <div className="premium-card rounded-xl p-6 md:p-8 bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Questions About Terms</h3>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <p className="text-gray-700 mt-3 text-sm md:text-base">
                  Email: <a href="mailto:legal@elitestore.com" className="text-gold-600 hover:underline">legal@elitestore.com</a><br />
                  Phone: +1 (555) 123-4567
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
