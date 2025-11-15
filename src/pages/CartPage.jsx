import React, { useState } from 'react';
import { useCartStore, useOrderStore, useAuthStore } from '../store';
import { CartItem } from '../components/CartItem';
import { ArrowRight, Package } from 'lucide-react';
import { downloadInvoice, sendInvoiceEmail } from '../utils/invoiceGenerator';

export function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const { user, isLoggedIn } = useAuthStore();
  const { addOrder } = useOrderStore();
  const [step, setStep] = useState('cart'); // cart, checkout, confirmation
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [buyNowItems, setBuyNowItems] = useState([]);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    country: user?.country || '',
    paymentType: 'prepaid',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });
  const [order, setOrder] = useState(null);

  // Check for Buy Now flow
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const buyNowParam = urlParams.get('buyNow');
    
    if (buyNowParam === 'true') {
      const buyNowProduct = sessionStorage.getItem('buyNowProduct');
      if (buyNowProduct) {
        const product = JSON.parse(buyNowProduct);
        setBuyNowItems([product]);
        setIsBuyNow(true);
        setStep('checkout');
        sessionStorage.removeItem('buyNowProduct');
      }
    }
  }, []);

  const activeItems = isBuyNow ? buyNowItems : items;
  const subtotal = isBuyNow 
    ? buyNowItems.reduce((total, item) => total + item.price * item.quantity, 0)
    : getTotal();
  const shipping = subtotal > 1000 ? 0 : 100;
  const total = parseFloat((subtotal + shipping).toFixed(2));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      alert('Please login first to checkout');
      window.location.href = '/login';
      return;
    }

    if (activeItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setStep('checkout');
  };

  const handlePlaceOrder = async () => {
    // Validate form
    if (!formData.firstName || !formData.email || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }

    // Create order
    const newOrder = {
      userId: user.id,
      items: activeItems.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      })),
      subtotal,
      tax: 0,
      shipping,
      total,
      status: 'pending',
      paymentMethod: 'Cash on Delivery',
      paymentType: 'cod',
      isPaid: false,
      createdAt: new Date().toISOString().split('T')[0],
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
      trackingNumber: null,
      carrier: null,
      shippingStatus: 'Pending',
      canCancel: true
    };

    addOrder(newOrder);
    setOrder(newOrder);
    
    // Automatically send invoice email
    try {
      await sendInvoiceEmail(newOrder, user);
    } catch (error) {
      console.error('Failed to send invoice email:', error);
    }
    
    // Clear cart only if not Buy Now
    if (!isBuyNow) {
      clearCart();
    }
    
    setStep('confirmation');
  };

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-gold py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gold-100 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
            <p className="text-sm text-green-600 font-semibold mb-6">📧 Invoice has been sent to your email</p>

            <div className="bg-gold-50 rounded-lg p-6 mb-8 text-left border border-gold-200">
              <p className="text-sm text-gray-600 mb-2"><strong>Order ID:</strong> {order.id}</p>
              <p className="text-sm text-gray-600 mb-2"><strong>Total:</strong> ₹{order.total.toFixed(2)}</p>
              <p className="text-sm text-gray-600"><strong>Status:</strong> <span className="text-yellow-600 font-semibold">Pending</span></p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button
                onClick={() => downloadInvoice(order, user)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold flex items-center justify-center gap-2"
              >
                <Package size={20} />
                Download Invoice
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/products" className="px-6 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition">
                Continue Shopping
              </a>
              <a href="/my-orders" className="px-6 py-3 border border-gold-500 text-gold-600 rounded-lg hover:bg-gold-50 transition">
                View Orders
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'checkout') {
    return (
      <div className="min-h-screen bg-gradient-gold py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gold-100 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name *"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name *"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="sm:col-span-2 px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="sm:col-span-2 px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address *"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="sm:col-span-2 px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-gold-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Information</h2>
                
                {/* Payment Type - COD Only */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">Payment Method</label>
                  <div className="p-4 border-2 border-gold-500 bg-gold-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Cash on Delivery (COD)</p>
                        <p className="text-sm text-gray-600 mt-1">Pay with cash when your order is delivered</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Important Information:</p>
                        <ul className="text-sm text-blue-800 mt-2 space-y-1">
                          <li>• Please keep exact change ready for smooth delivery</li>
                          <li>• Payment accepted in cash only upon delivery</li>
                          <li>• You can cancel your order anytime before delivery with no charges</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 border border-gold-100 sticky top-24">
                <h2 className="text-lg font-bold text-gray-800 mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {activeItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm text-gray-600">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gold-200 pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gold-200">
                    <span>Total</span>
                    <span className="text-gold-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full px-6 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition font-semibold flex items-center justify-center gap-2"
                >
                  Place Order
                  <ArrowRight size={18} />
                </button>
                {!isBuyNow && (
                  <button
                    onClick={() => setStep('cart')}
                    className="w-full mt-3 px-6 py-3 border border-gold-500 text-gold-600 rounded-lg hover:bg-gold-50 transition"
                  >
                    Back to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-gold py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={removeItem}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-md p-6 border border-gold-100 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-gold-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600 font-semibold">FREE</span> : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold text-gray-800 mb-6">
                  <span>Total</span>
                  <span className="text-gold-600">₹{total.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full px-6 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition font-semibold mb-3"
                >
                  Proceed to Checkout
                </button>
                <a href="/products" className="block w-full text-center px-6 py-3 border border-gold-500 text-gold-600 rounded-lg hover:bg-gold-50 transition">
                  Continue Shopping
                </a>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Free shipping on orders over ₹1000
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gold-100">
            <p className="text-gray-600 text-lg mb-6">Your cart is empty</p>
            <a href="/products" className="inline-block px-8 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition font-semibold">
              Start Shopping
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
