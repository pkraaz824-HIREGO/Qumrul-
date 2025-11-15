import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-gold py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-3 md:mb-4">Contact Us</h1>
          <p className="text-gray-700 text-base md:text-lg max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="premium-card rounded-xl p-6 md:p-8 text-center">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="text-white" size={28} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600 text-sm md:text-base">support@elitestore.com</p>
            <p className="text-gray-600 text-sm md:text-base">sales@elitestore.com</p>
          </div>

          <div className="premium-card rounded-xl p-6 md:p-8 text-center">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Phone className="text-white" size={28} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Phone</h3>
            <p className="text-gray-600 text-sm md:text-base">+1 (555) 123-4567</p>
            <p className="text-gray-600 text-sm md:text-base">Mon-Fri 9am-6pm EST</p>
          </div>

          <div className="premium-card rounded-xl p-6 md:p-8 text-center">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-white" size={28} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Location</h3>
            <p className="text-gray-600 text-sm md:text-base">123 Elite Avenue</p>
            <p className="text-gray-600 text-sm md:text-base">New York, NY 10001</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="premium-card rounded-xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Send us a Message</h2>
            
            {submitted && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 resize-none"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 btn-premium text-white rounded-lg hover:shadow-xl transition font-semibold text-base"
              >
                <Send size={20} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
