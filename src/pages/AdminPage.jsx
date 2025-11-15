import React, { useState, useMemo } from 'react';
import { useAuthStore, useProductStore, useUserStore, useOrderStore, useBannerStore } from '../store';
import { X, Plus, Edit2, Trash2, DollarSign, Users, Package, TrendingUp, Upload, Image as ImageIcon, Tag, Check, XCircle, Truck, Eye, RefreshCw, ChevronUp, ChevronDown, Monitor, Calendar, Filter } from 'lucide-react';

export function AdminPage() {
  const { user, isLoggedIn } = useAuthStore();
  const { products, addProduct, updateProduct, deleteProduct, categories, addCategory, deleteCategory } = useProductStore();
  const { users, updateUser, deleteUser } = useUserStore();
  const { orders, updateOrderStatus } = useOrderStore();
  const { banners, addBanner, updateBanner, deleteBanner, reorderBanners } = useBannerStore();
  
  const [activeTab, setActiveTab] = useState('products');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderFilter, setOrderFilter] = useState('all');
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState(null);
  
  // Logo Settings States
  const [logoUrl, setLogoUrl] = useState(localStorage.getItem('siteLogo') || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop');
  const [logoHeight, setLogoHeight] = useState(localStorage.getItem('logoHeight') || '48');
  const [logoMaxWidth, setLogoMaxWidth] = useState(localStorage.getItem('logoMaxWidth') || '200');
  
  // Analytics Modal States
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [revenueDateRange, setRevenueDateRange] = useState('all');
  const [orderDateRange, setOrderDateRange] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  const [bannerFormData, setBannerFormData] = useState({
    image: '',
    title: '',
    subtitle: '',
    link: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    brand: '',
    price: '',
    originalPrice: '',
    description: '',
    stock: '',
    image: '',
    images: [],
    featured: false
  });
  const [imagePreview, setImagePreview] = useState([]);

  // Check if user is admin
  if (!isLoggedIn || !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-gold py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-md p-12 border border-gold-100">
            <p className="text-gray-600 text-lg mb-6">Access denied. Admin privileges required.</p>
            <a href="/" className="inline-block px-8 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition font-semibold">
              Go Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const totalProducts = products.length;

  // Date filtering helper function
  const filterOrdersByDate = (orders, dateRange, customStart, customEnd) => {
    const now = new Date();
    
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      
      switch(dateRange) {
        case 'today':
          return orderDate.toDateString() === now.toDateString();
        
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return orderDate >= weekAgo;
        
        case 'month':
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          return orderDate >= monthAgo;
        
        case 'custom':
          if (!customStart || !customEnd) return true;
          const start = new Date(customStart);
          const end = new Date(customEnd);
          end.setHours(23, 59, 59, 999); // Include full end date
          return orderDate >= start && orderDate <= end;
        
        default: // 'all'
          return true;
      }
    });
  };

  // Filtered revenue data
  const filteredRevenueOrders = useMemo(() => {
    return filterOrdersByDate(orders, revenueDateRange, customStartDate, customEndDate);
  }, [orders, revenueDateRange, customStartDate, customEndDate]);

  const filteredRevenue = filteredRevenueOrders.reduce((sum, order) => sum + order.total, 0);

  // Filtered orders data
  const filteredOrdersData = useMemo(() => {
    return filterOrdersByDate(orders, orderDateRange, customStartDate, customEndDate);
  }, [orders, orderDateRange, customStartDate, customEndDate]);

  const filteredOrdersCount = filteredOrdersData.length;

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Create preview URLs for all selected images
    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    // In a real app, you would upload to a server here
    // For demo purposes, we'll use placeholder URLs
    const imageUrls = files.map((file, idx) => 
      `https://images.unsplash.com/photo-${Date.now() + idx}?w=800&h=800&fit=crop`
    );

    setImagePreview(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls],
      image: prev.image || imageUrls[0] // Set first image as main if not set
    }));
  };

  const handleRemoveImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        image: newImages.length > 0 ? newImages[0] : ''
      };
    });
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.category || !formData.price) {
      alert('Please fill in required fields: Name, Category, and Price');
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      originalPrice: parseFloat(formData.originalPrice) || parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0
    };

    if (editingId) {
      updateProduct(editingId, productData);
    } else {
      addProduct({
        ...productData,
        rating: 4.5,
        reviews: 0,
        sku: `SKU-${Date.now()}`
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      category: '',
      subcategory: '',
      brand: '',
      price: '',
      originalPrice: '',
      description: '',
      stock: '',
      image: '',
      images: [],
      featured: false
    });
    setImagePreview([]);
  };

  const handleEditProduct = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || '',
      brand: product.brand || '',
      price: product.price.toString(),
      originalPrice: product.originalPrice.toString(),
      description: product.description || '',
      stock: product.stock.toString(),
      image: product.image,
      images: product.images || [product.image],
      featured: product.featured || false
    });
    setImagePreview(product.images || [product.image]);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSaveBanner = () => {
    if (!bannerFormData.image || !bannerFormData.title) {
      alert('Please provide image URL and title');
      return;
    }

    if (editingBannerId) {
      updateBanner(editingBannerId, bannerFormData);
      alert('Banner updated successfully');
    } else {
      addBanner(bannerFormData);
      alert('Banner added successfully');
    }

    resetBannerForm();
  };

  const resetBannerForm = () => {
    setShowBannerForm(false);
    setEditingBannerId(null);
    setBannerFormData({
      image: '',
      title: '',
      subtitle: '',
      link: ''
    });
  };

  const handleEditBanner = (banner) => {
    setBannerFormData({
      image: banner.image,
      title: banner.title,
      subtitle: banner.subtitle,
      link: banner.link
    });
    setEditingBannerId(banner.id);
    setShowBannerForm(true);
  };

  const moveBannerUp = (index) => {
    if (index === 0) return;
    const newBanners = [...banners];
    [newBanners[index - 1], newBanners[index]] = [newBanners[index], newBanners[index - 1]];
    reorderBanners(newBanners);
  };

  const moveBannerDown = (index) => {
    if (index === banners.length - 1) return;
    const newBanners = [...banners];
    [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];
    reorderBanners(newBanners);
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      updateOrderStatus(orderId, 'cancelled');
      alert('Order cancelled successfully');
      setSelectedOrder(null);
    }
  };

  const handleRefundOrder = (orderId) => {
    if (window.confirm('Process refund for this order? The customer will receive their money back.')) {
      updateOrderStatus(orderId, 'refunded');
      alert('Refund processed successfully');
      setSelectedOrder(null);
    }
  };

  const filteredOrders = orderFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === orderFilter);

  const handleAddCategory = () => {
    const result = addCategory(newCategoryName);
    if (result.success) {
      setNewCategoryName('');
      setShowCategoryForm(false);
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  const handleDeleteCategory = (categoryName) => {
    if (window.confirm(`Delete category "${categoryName}"?`)) {
      const result = deleteCategory(categoryName);
      alert(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-gold py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.firstName}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => setShowRevenueModal(true)}
            className="bg-white rounded-lg shadow-md p-6 border border-gold-100 hover:border-gold-300 hover:shadow-xl transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 uppercase flex items-center gap-2">
                  Total Revenue
                  <Filter size={14} className="text-gray-400 group-hover:text-gold-500 transition" />
                </p>
                <p className="text-2xl font-bold text-gold-600">₹{totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Click to filter by date</p>
              </div>
              <DollarSign className="text-gold-500 group-hover:scale-110 transition" size={32} />
            </div>
          </button>

          <button
            onClick={() => setShowOrdersModal(true)}
            className="bg-white rounded-lg shadow-md p-6 border border-gold-100 hover:border-gold-300 hover:shadow-xl transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 uppercase flex items-center gap-2">
                  Total Orders
                  <Filter size={14} className="text-gray-400 group-hover:text-gold-500 transition" />
                </p>
                <p className="text-2xl font-bold text-gold-600">{totalOrders}</p>
                <p className="text-xs text-gray-500 mt-1">Click to filter by date</p>
              </div>
              <Package className="text-gold-500 group-hover:scale-110 transition" size={32} />
            </div>
          </button>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gold-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 uppercase">Total Users</p>
                <p className="text-2xl font-bold text-gold-600">{totalUsers}</p>
              </div>
              <Users className="text-gold-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gold-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 uppercase">Products</p>
                <p className="text-2xl font-bold text-gold-600">{totalProducts}</p>
              </div>
              <TrendingUp className="text-gold-500" size={32} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md border border-gold-100 overflow-hidden">
          <div className="flex border-b border-gold-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('banners')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'banners'
                  ? 'bg-gold-50 text-gold-600 border-b-2 border-gold-500'
                  : 'text-gray-700 hover:text-gold-600'
              }`}
            >
              Banners
            </button>
            <button
              onClick={() => setActiveTab('logo')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'logo'
                  ? 'bg-gold-50 text-gold-600 border-b-2 border-gold-500'
                  : 'text-gray-700 hover:text-gold-600'
              }`}
            >
              Logo
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'products'
                  ? 'bg-gold-50 text-gold-600 border-b-2 border-gold-500'
                  : 'text-gray-700 hover:text-gold-600'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'orders'
                  ? 'bg-gold-50 text-gold-600 border-b-2 border-gold-500'
                  : 'text-gray-700 hover:text-gold-600'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'users'
                  ? 'bg-gold-50 text-gold-600 border-b-2 border-gold-500'
                  : 'text-gray-700 hover:text-gold-600'
              }`}
            >
              Users
            </button>
          </div>

          {/* Banners Tab */}
          {activeTab === 'banners' && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => {
                    setShowBannerForm(true);
                    setEditingBannerId(null);
                    setBannerFormData({ image: '', title: '', subtitle: '', link: '' });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition"
                >
                  <Plus size={20} />
                  Add Banner
                </button>
                <p className="text-sm text-gray-600">Manage hero section banner carousel</p>
              </div>

              {/* Banner Form */}
              {showBannerForm && (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border-2 border-purple-200 mb-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Monitor className="text-purple-600" size={24} />
                      {editingBannerId ? 'Edit Banner' : 'Add New Banner'}
                    </h3>
                    <button onClick={resetBannerForm} className="text-gray-500 hover:text-gray-700">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Banner Image URL *</label>
                      <input
                        type="text"
                        value={bannerFormData.image}
                        onChange={(e) => setBannerFormData({ ...bannerFormData, image: e.target.value })}
                        placeholder="https://example.com/banner.jpg (1920x600 recommended)"
                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Banner Title *</label>
                      <input
                        type="text"
                        value={bannerFormData.title}
                        onChange={(e) => setBannerFormData({ ...bannerFormData, title: e.target.value })}
                        placeholder="e.g., Premium Laptops"
                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={bannerFormData.subtitle}
                        onChange={(e) => setBannerFormData({ ...bannerFormData, subtitle: e.target.value })}
                        placeholder="e.g., Up to 30% off"
                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Link URL</label>
                      <input
                        type="text"
                        value={bannerFormData.link}
                        onChange={(e) => setBannerFormData({ ...bannerFormData, link: e.target.value })}
                        placeholder="/products?category=Laptops"
                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  {bannerFormData.image && (
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Preview</label>
                      <div className="relative h-40 rounded-lg overflow-hidden">
                        <img src={bannerFormData.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
                          <div className="px-6">
                            <h3 className="text-2xl font-bold text-white">{bannerFormData.title || 'Banner Title'}</h3>
                            <p className="text-white/90">{bannerFormData.subtitle || 'Banner subtitle'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={handleSaveBanner}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold flex items-center gap-2"
                    >
                      <Monitor size={18} />
                      {editingBannerId ? 'Update Banner' : 'Add Banner'}
                    </button>
                    <button
                      onClick={resetBannerForm}
                      className="px-6 py-2 border border-purple-500 text-purple-600 rounded-lg hover:bg-purple-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Banners List */}
              <div className="space-y-4">
                {banners.sort((a, b) => a.order - b.order).map((banner, index) => (
                  <div key={banner.id} className="border-2 border-gold-200 rounded-xl p-4 bg-white hover:shadow-lg transition">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Banner Preview */}
                      <div className="relative w-full md:w-64 h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
                          Order: {banner.order}
                        </div>
                      </div>

                      {/* Banner Info */}
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg mb-1">{banner.title}</h4>
                        <p className="text-gray-600 text-sm mb-2">{banner.subtitle}</p>
                        {banner.link && (
                          <p className="text-blue-600 text-xs font-mono">{banner.link}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col gap-2">
                        <button
                          onClick={() => moveBannerUp(index)}
                          disabled={index === 0}
                          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ChevronUp size={18} />
                        </button>
                        <button
                          onClick={() => moveBannerDown(index)}
                          disabled={index === banners.length - 1}
                          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ChevronDown size={18} />
                        </button>
                        <button
                          onClick={() => handleEditBanner(banner)}
                          className="p-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete banner "${banner.title}"?`)) {
                              deleteBanner(banner.id);
                            }
                          }}
                          className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {banners.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Monitor className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-600 font-semibold">No banners created yet</p>
                    <p className="text-gray-500 text-sm">Click "Add Banner" to create your first banner</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => {
                    setShowForm(true);
                    setEditingId(null);
                    setFormData({
                      name: '',
                      category: '',
                      subcategory: '',
                      brand: '',
                      price: '',
                      originalPrice: '',
                      description: '',
                      stock: '',
                      image: '',
                      images: [],
                      featured: false
                    });
                    setImagePreview([]);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition"
                >
                  <Plus size={20} />
                  Add Product
                </button>
                <button
                  onClick={() => setShowCategoryForm(!showCategoryForm)}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-gold-500 text-gold-600 rounded-lg hover:bg-gold-50 transition"
                >
                  <Tag size={20} />
                  Manage Categories
                </button>
              </div>

              {/* Category Management Panel */}
              {showCategoryForm && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Tag className="text-blue-600" size={24} />
                      Category Management
                    </h3>
                    <button onClick={() => setShowCategoryForm(false)} className="text-gray-500 hover:text-gray-700">
                      <X size={24} />
                    </button>
                  </div>

                  {/* Add New Category */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Add New Category</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                        placeholder="Enter category name..."
                        className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleAddCategory}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2"
                      >
                        <Plus size={18} />
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Existing Categories */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Existing Categories ({categories.length})</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                      {categories.map(category => {
                        const productCount = products.filter(p => p.category === category).length;
                        return (
                          <div
                            key={category}
                            className="bg-white rounded-lg p-4 border border-blue-200 hover:shadow-md transition group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-bold text-gray-800">{category}</p>
                                <p className="text-xs text-gray-500 mt-1">{productCount} product{productCount !== 1 ? 's' : ''}</p>
                              </div>
                              <button
                                onClick={() => handleDeleteCategory(category)}
                                className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition p-1"
                                title="Delete category"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {showForm && (
                <div className="bg-gold-50 rounded-lg p-6 border border-gold-200 mb-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                    <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                      <X size={24} />
                    </button>
                  </div>

                  {/* Basic Information */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase">Basic Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name *</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="e.g., MacBook Pro 16"
                          value={formData.name}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Brand</label>
                        <input
                          type="text"
                          name="brand"
                          placeholder="e.g., Apple"
                          value={formData.brand}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Subcategory</label>
                        <input
                          type="text"
                          name="subcategory"
                          placeholder="e.g., Professional"
                          value={formData.subcategory}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Inventory */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase">Pricing & Inventory</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Price *</label>
                        <input
                          type="number"
                          name="price"
                          placeholder="0.00"
                          step="0.01"
                          value={formData.price}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Original Price</label>
                        <input
                          type="number"
                          name="originalPrice"
                          placeholder="0.00"
                          step="0.01"
                          value={formData.originalPrice}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Quantity</label>
                        <input
                          type="number"
                          name="stock"
                          placeholder="0"
                          value={formData.stock}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Images */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase">Product Images</h4>
                    
                    {/* Image Upload */}
                    <div className="mb-4">
                      <label className="block w-full">
                        <div className="border-2 border-dashed border-gold-300 rounded-lg p-6 text-center hover:border-gold-500 cursor-pointer transition bg-white">
                          <Upload className="mx-auto text-gold-500 mb-2" size={32} />
                          <p className="text-sm font-semibold text-gray-700 mb-1">Click to upload images</p>
                          <p className="text-xs text-gray-500">Upload multiple images (JPEG, PNG, WebP)</p>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </div>
                      </label>
                    </div>

                    {/* Image Previews */}
                    {imagePreview.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-3">
                          Uploaded Images ({imagePreview.length})
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {imagePreview.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border-2 border-gold-200"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                              >
                                <X size={16} />
                              </button>
                              {index === 0 && (
                                <span className="absolute bottom-1 left-1 bg-gold-500 text-white text-xs px-2 py-1 rounded font-semibold">
                                  Main
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Alternative: Image URL input */}
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Or enter Image URL</label>
                      <input
                        type="text"
                        name="image"
                        placeholder="https://example.com/image.jpg"
                        value={formData.image}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase">Description</h4>
                    <textarea
                      name="description"
                      placeholder="Enter detailed product description..."
                      value={formData.description}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      rows="4"
                    />
                  </div>

                  {/* Additional Options */}
                  <div className="mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleFormChange}
                        className="w-4 h-4 text-gold-500 border-gold-300 rounded focus:ring-gold-500"
                      />
                      <span className="text-sm font-semibold text-gray-700">Mark as Featured Product</span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4 border-t border-gold-300">
                    <button
                      onClick={handleSaveProduct}
                      className="px-6 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition font-semibold flex items-center gap-2"
                    >
                      <Package size={18} />
                      {editingId ? 'Update Product' : 'Add Product'}
                    </button>
                    <button
                      onClick={resetForm}
                      className="px-6 py-2 border border-gold-500 text-gold-600 rounded-lg hover:bg-gold-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold-200">
                      <th className="text-left px-4 py-3 font-bold text-gray-800">Image</th>
                      <th className="text-left px-4 py-3 font-bold text-gray-800">Name</th>
                      <th className="text-left px-4 py-3 font-bold text-gray-800">Brand</th>
                      <th className="text-left px-4 py-3 font-bold text-gray-800">Category</th>
                      <th className="text-left px-4 py-3 font-bold text-gray-800">Price</th>
                      <th className="text-left px-4 py-3 font-bold text-gray-800">Stock</th>
                      <th className="text-left px-4 py-3 font-bold text-gray-800">Status</th>
                      <th className="text-left px-4 py-3 font-bold text-gray-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-b border-gold-100 hover:bg-gold-50">
                        <td className="px-4 py-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-gold-200">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-800 font-semibold">{product.name}</p>
                          {product.sku && (
                            <p className="text-xs text-gray-500">{product.sku}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                          {product.brand || '-'}
                        </td>
                        <td className="px-4 py-3 text-gray-800">{product.category}</td>
                        <td className="px-4 py-3">
                          <p className="text-gold-600 font-semibold">₹{product.price.toFixed(2)}</p>
                          {product.originalPrice > product.price && (
                            <p className="text-xs text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            product.stock > 10 ? 'bg-green-100 text-green-700' : 
                            product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-red-100 text-red-700'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {product.featured && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gold-100 text-gold-700 rounded text-xs font-bold">
                              <ImageIcon size={12} />
                              Featured
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="text-blue-600 hover:text-blue-700 p-1"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${product.name}"?`)) {
                                  deleteProduct(product.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-700 p-1"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="p-6">
              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <h3 className="text-lg font-bold text-gray-800">Order Management</h3>
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => setOrderFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                      orderFilter === 'all'
                        ? 'bg-gold-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All ({orders.length})
                  </button>
                  <button
                    onClick={() => setOrderFilter('pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                      orderFilter === 'pending'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Pending ({orders.filter(o => o.status === 'pending').length})
                  </button>
                  <button
                    onClick={() => setOrderFilter('processing')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                      orderFilter === 'processing'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Processing ({orders.filter(o => o.status === 'processing').length})
                  </button>
                  <button
                    onClick={() => setOrderFilter('delivered')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                      orderFilter === 'delivered'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Delivered ({orders.filter(o => o.status === 'delivered').length})
                  </button>
                  <button
                    onClick={() => setOrderFilter('cancelled')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                      orderFilter === 'cancelled'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Cancelled ({orders.filter(o => o.status === 'cancelled').length})
                  </button>
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <div key={order.id} className="border-2 border-gold-200 rounded-xl p-5 hover:shadow-lg transition bg-white">
                      {/* Order Header */}
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 pb-4 border-b border-gold-100">
                        <div className="flex items-center gap-4">
                          <div className="bg-gradient-to-br from-gold-100 to-gold-200 p-3 rounded-lg">
                            <Package className="text-gold-700" size={24} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 font-medium">Order ID</p>
                            <p className="font-black text-gray-900 text-lg">{order.id}</p>
                            <p className="text-xs text-gray-500 mt-1">Placed on {order.createdAt}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          {/* Total Amount */}
                          <div className="bg-gradient-to-br from-green-50 to-green-100 px-4 py-2 rounded-lg border border-green-200">
                            <p className="text-xs text-green-700 font-semibold">Total Amount</p>
                            <p className="font-black text-green-800 text-xl">₹{order.total.toFixed(2)}</p>
                          </div>

                          {/* Payment Type */}
                          <div className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            order.paymentType === 'prepaid'
                              ? 'bg-blue-100 text-blue-700 border border-blue-300'
                              : 'bg-orange-100 text-orange-700 border border-orange-300'
                          }`}>
                            {order.paymentType === 'prepaid' ? 'PREPAID' : 'COD'}
                          </div>

                          {/* Order Status Badge */}
                          <div className={`px-4 py-2 rounded-lg text-sm font-bold uppercase flex items-center gap-2 ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-700 border-2 border-green-300'
                              : order.status === 'processing'
                              ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-700 border-2 border-red-300'
                              : order.status === 'refunded'
                              ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                              : 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                          }`}>
                            {order.status === 'delivered' && <Check size={16} />}
                            {order.status === 'processing' && <Truck size={16} />}
                            {order.status === 'cancelled' && <XCircle size={16} />}
                            {order.status === 'refunded' && <RefreshCw size={16} />}
                            {order.status}
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mb-4">
                        <p className="text-sm font-bold text-gray-700 mb-3">Order Items ({order.items.length})</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded border border-gray-300"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                                <p className="text-xs text-gray-600">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer & Shipping Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-gold-100">
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <p className="text-xs font-bold text-blue-700 mb-2">CUSTOMER INFO</p>
                          <p className="text-sm text-gray-800 font-semibold">User ID: {order.userId}</p>
                          <p className="text-sm text-gray-600 mt-1">{order.shippingAddress}</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                          <p className="text-xs font-bold text-purple-700 mb-2">SHIPPING INFO</p>
                          {order.trackingNumber && (
                            <p className="text-sm text-gray-800 font-mono">
                              <span className="font-bold">Tracking:</span> {order.trackingNumber}
                            </p>
                          )}
                          {order.carrier && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-bold">Carrier:</span> {order.carrier}
                            </p>
                          )}
                          {order.estimatedDelivery && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-bold">Est. Delivery:</span> {order.estimatedDelivery}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Admin Actions */}
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm font-bold text-gray-700 mr-2">Admin Actions:</p>
                        
                        {/* Status Update */}
                        <select
                          value={order.status}
                          onChange={(e) => {
                            if (window.confirm(`Update order status to "${e.target.value}"?`)) {
                              updateOrderStatus(order.id, e.target.value);
                            }
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition cursor-pointer ${
                            order.status === 'delivered'
                              ? 'bg-green-50 text-green-700 border-green-300'
                              : order.status === 'processing'
                              ? 'bg-blue-50 text-blue-700 border-blue-300'
                              : order.status === 'cancelled'
                              ? 'bg-red-50 text-red-700 border-red-300'
                              : 'bg-yellow-50 text-yellow-700 border-yellow-300'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="refunded">Refunded</option>
                        </select>

                        {/* Quick Action Buttons */}
                        {order.status !== 'cancelled' && order.status !== 'refunded' && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-bold text-sm flex items-center gap-2 shadow-md"
                          >
                            <XCircle size={16} />
                            Cancel Order
                          </button>
                        )}

                        {order.status === 'cancelled' && order.paymentType === 'prepaid' && order.status !== 'refunded' && (
                          <button
                            onClick={() => handleRefundOrder(order.id)}
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-bold text-sm flex items-center gap-2 shadow-md"
                          >
                            <RefreshCw size={16} />
                            Process Refund
                          </button>
                        )}

                        {order.status === 'pending' && (
                          <button
                            onClick={() => {
                              if (window.confirm('Mark order as processing?')) {
                                updateOrderStatus(order.id, 'processing');
                              }
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-bold text-sm flex items-center gap-2 shadow-md"
                          >
                            <Truck size={16} />
                            Start Processing
                          </button>
                        )}

                        {(order.status === 'processing' || order.status === 'shipped') && (
                          <button
                            onClick={() => {
                              if (window.confirm('Mark order as delivered?')) {
                                updateOrderStatus(order.id, 'delivered');
                              }
                            }}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-bold text-sm flex items-center gap-2 shadow-md"
                          >
                            <Check size={16} />
                            Mark Delivered
                          </button>
                        )}

                        {/* View Details */}
                        <button
                          onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                          className="px-4 py-2 border-2 border-gold-500 text-gold-600 rounded-lg hover:bg-gold-50 transition font-bold text-sm flex items-center gap-2"
                        >
                          <Eye size={16} />
                          {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>

                      {/* Expanded Order Details */}
                      {selectedOrder?.id === order.id && (
                        <div className="mt-4 pt-4 border-t-2 border-gold-200 bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg">
                          <h4 className="font-bold text-gray-800 mb-3">Complete Order Timeline</h4>
                          {order.timeline && order.timeline.length > 0 ? (
                            <div className="space-y-2">
                              {order.timeline.map((event, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                  <div className={`w-3 h-3 rounded-full mt-1 ${
                                    event.completed ? 'bg-green-500' : 'bg-gray-300'
                                  }`}></div>
                                  <div>
                                    <p className={`text-sm font-semibold ${
                                      event.completed ? 'text-gray-800' : 'text-gray-500'
                                    }`}>
                                      {event.status}
                                    </p>
                                    <p className="text-xs text-gray-600">{event.date}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600">No timeline available for this order.</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gold-200">
                    <Package className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-600 font-semibold">No orders found in this category</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold-200">
                      <th className="text-left px-4 py-3 font-bold text-gray-800">Name</th>
                      <th className="text-left px-4 py-3 font-bold text-gray-800">Email</th>
                      <th className="text-left px-4 py-3 font-bold text-gray-800">Role</th>
                      <th className="text-left px-4 py-3 font-bold text-gray-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-gold-100 hover:bg-gold-50">
                        <td className="px-4 py-3 text-gray-800">{u.firstName} {u.lastName}</td>
                        <td className="px-4 py-3 text-gray-800">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            u.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {u.isAdmin ? 'Admin' : 'Customer'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete user ${u.email}?`)) {
                                deleteUser(u.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-700 p-1"
                            disabled={u.isAdmin && u.id === user.id}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Revenue Analytics Modal */}
      {showRevenueModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeInUp">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl animate-fadeInUp">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Revenue Analytics</h3>
                  <p className="text-sm text-gray-600">Filter revenue by date range</p>
                </div>
              </div>
              <button onClick={() => setShowRevenueModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={28} />
              </button>
            </div>

            {/* Date Range Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Select Date Range</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => setRevenueDateRange('today')}
                  className={`px-4 py-3 rounded-lg font-semibold transition ${
                    revenueDateRange === 'today'
                      ? 'bg-gold-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setRevenueDateRange('week')}
                  className={`px-4 py-3 rounded-lg font-semibold transition ${
                    revenueDateRange === 'week'
                      ? 'bg-gold-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setRevenueDateRange('month')}
                  className={`px-4 py-3 rounded-lg font-semibold transition ${
                    revenueDateRange === 'month'
                      ? 'bg-gold-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  This Month
                </button>
                <button
                  onClick={() => setRevenueDateRange('all')}
                  className={`px-4 py-3 rounded-lg font-semibold transition ${
                    revenueDateRange === 'all'
                      ? 'bg-gold-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Time
                </button>
              </div>
            </div>

            {/* Custom Date Range */}
            <div className="mb-6">
              <button
                onClick={() => setRevenueDateRange('custom')}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition mb-3 ${
                  revenueDateRange === 'custom'
                    ? 'bg-gold-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Calendar size={18} className="inline mr-2" />
                Custom Date Range
              </button>
              {revenueDateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Revenue Summary */}
            <div className="bg-gradient-to-br from-gold-50 to-yellow-50 rounded-xl p-6 border-2 border-gold-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-4xl font-bold gradient-text">₹{filteredRevenue.toFixed(2)}</p>
                </div>
                <TrendingUp className="text-gold-500" size={48} />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gold-200">
                <div>
                  <p className="text-xs text-gray-600">Orders Count</p>
                  <p className="text-xl font-bold text-gray-800">{filteredRevenueOrders.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Average Order</p>
                  <p className="text-xl font-bold text-gray-800">
                    ₹{filteredRevenueOrders.length > 0 ? (filteredRevenue / filteredRevenueOrders.length).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Orders in Range */}
            {filteredRevenueOrders.length > 0 && (
              <div className="mt-6">
                <h4 className="font-bold text-gray-800 mb-3">Orders in Selected Range ({filteredRevenueOrders.length})</h4>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredRevenueOrders.slice(0, 10).map((order) => (
                    <div key={order.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200">
                      <div>
                        <p className="font-semibold text-sm text-gray-800">{order.id}</p>
                        <p className="text-xs text-gray-600">{order.createdAt}</p>
                      </div>
                      <p className="font-bold text-gold-600">₹{order.total.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Orders Analytics Modal */}
      {showOrdersModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeInUp">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl animate-fadeInUp">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Package className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Orders Analytics</h3>
                  <p className="text-sm text-gray-600">Filter orders by date range</p>
                </div>
              </div>
              <button onClick={() => setShowOrdersModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={28} />
              </button>
            </div>

            {/* Date Range Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Select Date Range</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => setOrderDateRange('today')}
                  className={`px-4 py-3 rounded-lg font-semibold transition ${
                    orderDateRange === 'today'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setOrderDateRange('week')}
                  className={`px-4 py-3 rounded-lg font-semibold transition ${
                    orderDateRange === 'week'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setOrderDateRange('month')}
                  className={`px-4 py-3 rounded-lg font-semibold transition ${
                    orderDateRange === 'month'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  This Month
                </button>
                <button
                  onClick={() => setOrderDateRange('all')}
                  className={`px-4 py-3 rounded-lg font-semibold transition ${
                    orderDateRange === 'all'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Time
                </button>
              </div>
            </div>

            {/* Custom Date Range */}
            <div className="mb-6">
              <button
                onClick={() => setOrderDateRange('custom')}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition mb-3 ${
                  orderDateRange === 'custom'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Calendar size={18} className="inline mr-2" />
                Custom Date Range
              </button>
              {orderDateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Orders Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Total Orders</p>
                  <p className="text-4xl font-bold text-blue-600">{filteredOrdersCount}</p>
                </div>
                <Package className="text-blue-500" size={48} />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-blue-200">
                <div>
                  <p className="text-xs text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-orange-600">
                    {filteredOrdersData.filter(o => o.status === 'pending').length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Delivered</p>
                  <p className="text-xl font-bold text-green-600">
                    {filteredOrdersData.filter(o => o.status === 'delivered').length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Cancelled</p>
                  <p className="text-xl font-bold text-red-600">
                    {filteredOrdersData.filter(o => o.status === 'cancelled').length}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Orders in Range */}
            {filteredOrdersData.length > 0 && (
              <div className="mt-6">
                <h4 className="font-bold text-gray-800 mb-3">Orders in Selected Range ({filteredOrdersData.length})</h4>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredOrdersData.slice(0, 10).map((order) => (
                    <div key={order.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200">
                      <div>
                        <p className="font-semibold text-sm text-gray-800">{order.id}</p>
                        <p className="text-xs text-gray-600">{order.createdAt}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-gray-600 capitalize">{order.status}</p>
                        <p className="font-bold text-gray-800">₹{order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
