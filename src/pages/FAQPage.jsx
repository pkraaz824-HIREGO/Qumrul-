import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'Orders & Shipping',
      questions: [
        {
          q: 'How long does shipping take?',
          a: 'Standard shipping takes 3-5 business days. Express shipping (1-2 days) and next-day delivery options are also available at checkout.'
        },
        {
          q: 'Do you offer free shipping?',
          a: 'Yes! We offer free standard shipping on all orders over ₹1000. Premium members enjoy free shipping on all orders regardless of amount.'
        },
        {
          q: 'Can I track my order?',
          a: 'Absolutely! Once your order ships, you\'ll receive a tracking number via email. You can also track your order from the "My Orders" section of your account.'
        },
        {
          q: 'Can I change my shipping address after placing an order?',
          a: 'If your order hasn\'t shipped yet, please contact customer support immediately at support@elitestore.com and we\'ll update the address for you.'
        }
      ]
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          q: 'What is your return policy?',
          a: 'We offer a 30-day return policy on most items. Products must be in original condition with all tags and packaging intact.'
        },
        {
          q: 'How do I return an item?',
          a: 'Log into your account, go to "My Orders", select the item you want to return, and click "Request Return". We\'ll email you a prepaid return label.'
        },
        {
          q: 'When will I receive my refund?',
          a: 'Refunds are processed within 5-7 business days after we receive and inspect your return. The refund will be issued to your original payment method.'
        },
        {
          q: 'Can I cancel a Cash on Delivery order?',
          a: 'Yes! COD orders can be cancelled at any time before shipment without any charges. Once shipped, standard return policies apply.'
        }
      ]
    },
    {
      category: 'Payment & Pricing',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit/debit cards, UPI, net banking, mobile wallets, and Cash on Delivery for eligible orders.'
        },
        {
          q: 'Is it safe to use my credit card on your website?',
          a: 'Yes! We use industry-standard SSL encryption and PCI-DSS compliant payment gateways to ensure your payment information is completely secure.'
        },
        {
          q: 'Do you offer EMI options?',
          a: 'Yes, we offer EMI options on orders above ₹5000 through select credit cards and payment partners. EMI options will be displayed at checkout.'
        }
      ]
    },
    {
      category: 'Account & Membership',
      questions: [
        {
          q: 'Do I need an account to place an order?',
          a: 'Yes, creating an account allows you to track orders, save addresses, view order history, and enjoy a faster checkout experience.'
        },
        {
          q: 'How do I reset my password?',
          a: 'Click on "Login" and then "Forgot Password". Enter your registered email address and we\'ll send you instructions to reset your password.'
        },
        {
          q: 'Can I change my account information?',
          a: 'Yes, you can update your personal information, email address, and saved addresses from the "My Account" section after logging in.'
        }
      ]
    },
    {
      category: 'Products',
      questions: [
        {
          q: 'Are all products genuine?',
          a: 'Yes! We only sell 100% authentic products directly from authorized distributors and manufacturers. All items come with official warranties.'
        },
        {
          q: 'What if I receive a damaged or defective product?',
          a: 'We\'re sorry to hear that! Please contact customer support within 48 hours of delivery with photos of the damage. We\'ll arrange a free replacement or full refund.'
        },
        {
          q: 'Do you offer product warranties?',
          a: 'Yes, all products come with manufacturer warranties. Warranty periods vary by product and brand. Details are mentioned on each product page.'
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-gradient-gold py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="text-white" size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-3 md:mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-700 text-base md:text-lg max-w-2xl mx-auto">
            Find answers to common questions about our products, shipping, returns, and more.
          </p>
        </div>

        <div className="space-y-6 md:space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="premium-card rounded-xl p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold gradient-text mb-4 md:mb-6">
                {category.category}
              </h2>
              <div className="space-y-3 md:space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const key = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openIndex === key;
                  
                  return (
                    <div
                      key={questionIndex}
                      className="border border-gold-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                        className="w-full flex items-center justify-between p-4 md:p-5 bg-white hover:bg-gold-50 transition text-left"
                      >
                        <span className="font-semibold text-gray-900 pr-4 text-sm md:text-base">
                          {faq.q}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="text-gold-600 flex-shrink-0" size={20} />
                        ) : (
                          <ChevronDown className="text-gold-600 flex-shrink-0" size={20} />
                        )}
                      </button>
                      {isOpen && (
                        <div className="p-4 md:p-5 pt-0 bg-gold-50/50">
                          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 md:mt-12 premium-card rounded-xl p-6 md:p-8 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            Still have questions?
          </h3>
          <p className="text-gray-700 mb-6">
            Our customer support team is here to help you.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 md:px-8 py-3 md:py-4 btn-premium text-white rounded-lg hover:shadow-xl transition font-semibold text-sm md:text-base"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
