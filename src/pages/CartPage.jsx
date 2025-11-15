import React, { useState } from 'react';
import { useCartStore, useOrderStore, useAuthStore } from '../store';
import { CartItem } from '../components/CartItem';
import { ArrowRight } from 'lucide-react';

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
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const shipping = subtotal > 1000 ? 0 : 100;
  const total = parseFloat((subtotal + tax + shipping).toFixed(2));

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

  const handlePlaceOrder = () => {
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
      tax,
      shipping,
      total,
      status: 'pending',
      paymentMethod: formData.paymentType === 'cod' ? 'Cash on Delivery' : 'Credit Card',
      paymentType: formData.paymentType,
      isPaid: formData.paymentType === 'prepaid',
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
            <p className="text-gray-600 mb-6">Thank you for your purchase.</p>

            <div className="bg-gold-50 rounded-lg p-6 mb-8 text-left border border-gold-200">
              <p className="text-sm text-gray-600 mb-2"><strong>Order ID:</strong> {order.id}</p>
              <p className="text-sm text-gray-600 mb-2"><strong>Total:</strong> ₹{order.total.toFixed(2)}</p>
              <p className="text-sm text-gray-600"><strong>Status:</strong> <span className="text-yellow-600 font-semibold">Pending</span></p>
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
                
                {/* Payment Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">Payment Method</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentType: 'prepaid' }))}
                      className={`p-4 border-2 rounded-lg transition ${
                        formData.paymentType === 'prepaid'
                          ? 'border-gold-500 bg-gold-50'
                          : 'border-gray-200 hover:border-gold-300'
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-bold text-gray-900">Credit/Debit Card</p>
                        <p className="text-xs text-gray-600 mt-1">Pay now securely</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentType: 'cod' }))}
                      className={`p-4 border-2 rounded-lg transition ${
                        formData.paymentType === 'cod'
                          ? 'border-gold-500 bg-gold-50'
                          : 'border-gray-200 hover:border-gold-300'
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-bold text-gray-900">Cash on Delivery</p>
                        <p className="text-xs text-gray-600 mt-1">Pay when delivered</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Card Details (only for prepaid) */}
                {formData.paymentType === 'prepaid' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="cardName"
                      placeholder="Cardholder Name"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="sm:col-span-2 px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="sm:col-span-2 px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                    <input
                      type="text"
                      name="cardExpiry"
                      placeholder="MM/YY"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      className="px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                    <input
                      type="text"
                      name="cardCvv"
                      placeholder="CVV"
                      value={formData.cardCvv}
                      onChange={handleInputChange}
                      className="px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                )}

                {/* COD Note */}
                {formData.paymentType === 'cod' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> You can cancel COD orders anytime before delivery with no charges.
                    </p>
                  </div>
                )}
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
                    <span>Tax (8%)</span>
                    <span>₹{tax.toFixed(2)}</span>
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
                    <span>Tax (8%)</span>
                    <span>₹{tax.toFixed(2)}</span>
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
