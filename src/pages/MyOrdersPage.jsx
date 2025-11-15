import React, { useState } from 'react';
import { useAuthStore, useOrderStore } from '../store';
import { Package, Truck, CheckCircle, XCircle, Clock, MapPin, Phone, CreditCard, Calendar, AlertCircle, Download, Mail } from 'lucide-react';

export function MyOrdersPage() {
  const { user, isLoggedIn } = useAuthStore();
  const { getOrdersByUserId, cancelOrder } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [emailSending, setEmailSending] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadInvoice = async (order) => {
    setDownloading(true);
    try {
      const token = localStorage.getItem('user');
      const userObj = token ? JSON.parse(token) : null;
      
      if (!userObj) {
        alert('Please login to download invoice');
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      // Call backend API to get PDF
      const response = await fetch(`${API_URL}/api/orders/${order.id}/invoice`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userObj.token || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${order.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download invoice. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleEmailInvoice = async (order) => {
    setEmailSending(true);
    try {
      alert('Invoice email feature will be available once SMTP is configured on the server.');
    } catch (error) {
      alert('Failed to send invoice email');
    } finally {
      setEmailSending(false);
    }
  };

  const handleCancelClick = (order) => {
    setOrderToCancel(order);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    const result = cancelOrder(orderToCancel.id, cancelReason);
    alert(result.message);
    
    if (result.success) {
      setShowCancelModal(false);
      setCancelReason('');
      setOrderToCancel(null);
      setSelectedOrder(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-700 bg-green-100';
      case 'shipped': return 'text-blue-700 bg-blue-100';
      case 'processing': return 'text-yellow-700 bg-yellow-100';
      case 'pending': return 'text-orange-700 bg-orange-100';
      case 'cancelled': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const canCancelOrder = (order) => {
    if (order.status === 'cancelled' || order.status === 'delivered') return false;
    if (order.paymentType === 'cod') {
      return order.status !== 'delivered';
    }
    return order.status === 'pending' || order.status === 'processing';
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-gold py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-md p-12 border border-gold-100">
            <p className="text-gray-600 text-lg mb-6">Please login to view your orders</p>
            <a href="/login" className="inline-block px-8 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition font-semibold">
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  const orders = getOrdersByUserId(user.id);

  return (
    <div className="min-h-screen bg-gradient-gold py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold gradient-text mb-8">My Orders</h1>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="premium-card rounded-2xl p-6 animate-fadeInUp">
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-6 border-b border-gold-200 gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Package className="text-gold-600" size={24} />
                      <h3 className="text-xl font-bold text-gray-900">Order {order.id}</h3>
                    </div>
                    <p className="text-sm text-gray-600">Placed on {order.createdAt}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)} capitalize`}>
                      {order.status}
                    </span>
                    <span className="text-2xl font-bold gradient-text">₹{order.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="py-6 border-b border-gold-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-gold-200">
                  <div className="flex items-start gap-2">
                    <CreditCard className="text-gold-600 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-xs text-gray-600 uppercase mb-1">Payment</p>
                      <p className="text-sm font-semibold text-gray-900">{order.paymentMethod}</p>
                      <p className="text-xs text-gray-600 capitalize">({order.paymentType})</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Calendar className="text-gold-600 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-xs text-gray-600 uppercase mb-1">Est. Delivery</p>
                      <p className="text-sm font-semibold text-gray-900">{order.estimatedDelivery || 'TBD'}</p>
                    </div>
                  </div>
                  
                  {order.trackingNumber && (
                    <div className="flex items-start gap-2">
                      <Truck className="text-gold-600 flex-shrink-0" size={20} />
                      <div>
                        <p className="text-xs text-gray-600 uppercase mb-1">Tracking</p>
                        <p className="text-sm font-semibold text-gray-900">{order.trackingNumber}</p>
                        <p className="text-xs text-gray-600">{order.carrier}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="text-gold-600 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-xs text-gray-600 uppercase mb-1">Deliver To</p>
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2">{order.shippingAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-6">
                  <button
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    className="px-6 py-2 btn-premium text-white rounded-full hover:shadow-xl transition font-semibold"
                  >
                    {selectedOrder?.id === order.id ? 'Hide Details' : 'Track Order'}
                  </button>
                  
                  <button
                    onClick={() => handleDownloadInvoice(order)}
                    disabled={downloading}
                    className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 hover:shadow-xl transition font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download size={18} />
                    {downloading ? 'Downloading...' : 'Download Invoice'}
                  </button>
                  
                  <button
                    onClick={() => handleEmailInvoice(order)}
                    disabled={emailSending}
                    className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 hover:shadow-xl transition font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Mail size={18} />
                    {emailSending ? 'Sending...' : 'Email Invoice'}
                  </button>
                  
                  {canCancelOrder(order) && (
                    <button
                      onClick={() => handleCancelClick(order)}
                      className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 hover:shadow-xl transition font-semibold"
                    >
                      Cancel Order
                    </button>
                  )}
                  
                  {order.status === 'cancelled' && order.refundStatus && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full">
                      <AlertCircle className="text-yellow-600" size={18} />
                      <span className="text-sm font-semibold text-yellow-700">
                        Refund Status: {order.refundStatus === 'pending' ? 'Processing' : order.refundStatus}
                      </span>
                    </div>
                  )}
                </div>

                {selectedOrder?.id === order.id && (
                  <div className="mt-8 pt-8 border-t-2 border-gold-300 bg-gradient-to-br from-gold-50/30 to-transparent rounded-xl p-6">
                    {/* Order Timeline */}
                    <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Clock className="text-gold-600" size={22} />
                      Order Tracking Timeline
                    </h4>
                    
                    {order.timeline && order.timeline.length > 0 ? (
                      <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gold-200"></div>
                        
                        {/* Timeline Items */}
                        <div className="space-y-6">
                          {order.timeline.map((event, idx) => (
                            <div key={idx} className="relative flex items-start gap-4">
                              <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                event.completed
                                  ? 'bg-gradient-to-br from-gold-500 to-gold-600 shadow-lg'
                                  : 'bg-gray-200 border-2 border-gray-300'
                              }`}>
                                {event.completed ? (
                                  <CheckCircle className="text-white" size={18} />
                                ) : (
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                )}
                              </div>
                              
                              <div className="flex-1 bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className={`font-bold ${
                                      event.completed ? 'text-gray-900' : 'text-gray-500'
                                    }`}>
                                      {event.status}
                                    </p>
                                    {event.date && (
                                      <p className="text-sm text-gray-600 mt-1">{event.date}</p>
                                    )}
                                  </div>
                                  {event.completed && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                                      Completed
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <Clock className="text-blue-600 mx-auto mb-3" size={32} />
                        <p className="text-blue-900 font-semibold mb-1">Order Tracking</p>
                        <p className="text-blue-700 text-sm">Your order is being processed. Tracking information will be updated soon.</p>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between bg-white rounded-lg p-3">
                            <span className="text-sm text-gray-700">Order Status:</span>
                            <span className={`text-sm font-bold px-3 py-1 rounded-full ${getStatusColor(order.status)} capitalize`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-white rounded-lg p-3">
                            <span className="text-sm text-gray-700">Estimated Delivery:</span>
                            <span className="text-sm font-semibold text-gray-900">{order.estimatedDelivery || 'TBD'}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Items Detail */}
                    <div className="mt-8">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Package className="text-gold-600" size={20} />
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
                            <div className="flex items-center gap-4">
                              {item.image && (
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                              )}
                              <div>
                                <p className="font-semibold text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="font-bold text-gold-600">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="mt-8 bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin className="text-gold-600" size={20} />
                        Shipping Address
                      </h4>
                      <p className="text-gray-700">{order.shippingAddress}</p>
                    </div>

                    {/* Order Summary */}
                    <div className="mt-8 bg-gradient-to-br from-gray-50 to-white rounded-lg p-6 shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-4">Order Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-gray-700">
                          <span>Subtotal</span>
                          <span>₹{order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                          <span>Tax</span>
                          <span>₹{order.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                          <span>Shipping</span>
                          <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t-2 border-gold-300 mt-2">
                          <span>Total</span>
                          <span className="gradient-text">₹{order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gold-100">
            <p className="text-gray-600 text-lg mb-6">You haven't placed any orders yet</p>
            <a href="/products" className="inline-block px-8 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition font-semibold">
              Start Shopping
            </a>
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && orderToCancel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeInUp">
          <div className="premium-card rounded-2xl max-w-lg w-full p-8 animate-fadeInUp">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <XCircle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Cancel Order</h3>
                <p className="text-gray-600">Order ID: {orderToCancel.id}</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Cancellation Policy:</p>
                  {orderToCancel.paymentType === 'cod' ? (
                    <p>COD orders can be cancelled anytime before delivery with no charges.</p>
                  ) : (
                    <p>Prepaid orders can be cancelled before shipping. Refund will be processed within 5-7 business days.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Reason for Cancellation *
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please tell us why you're cancelling this order..."
                className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 resize-none"
                rows="4"
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Order Total:</span>
                <span className="font-bold text-gray-900">₹{orderToCancel.total.toFixed(2)}</span>
              </div>
              {orderToCancel.paymentType === 'prepaid' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Refund Amount:</span>
                  <span className="font-semibold text-green-600">₹{orderToCancel.total.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                  setOrderToCancel(null);
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition font-semibold"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelConfirm}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 hover:shadow-xl transition font-semibold"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
