import { create } from 'zustand';
import { mockProducts, mockUsers, mockOrders, mockReviews } from '../data/mockData';

// Banner Store
export const useBannerStore = create((set, get) => ({
  banners: [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1920&h=600&fit=crop',
      title: 'Premium Laptops',
      subtitle: 'Up to 30% off on select models',
      link: '/products?category=Laptops',
      order: 1
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1920&h=600&fit=crop',
      title: 'Latest Mobile Phones',
      subtitle: 'Discover cutting-edge technology',
      link: '/products?category=Mobile Phones',
      order: 2
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920&h=600&fit=crop',
      title: 'Exclusive Deals',
      subtitle: 'Limited time offers on accessories',
      link: '/products?category=Accessories',
      order: 3
    }
  ],
  
  addBanner: (banner) => {
    const newBanner = {
      ...banner,
      id: Date.now(),
      order: get().banners.length + 1
    };
    set({ banners: [...get().banners, newBanner] });
  },
  
  updateBanner: (id, updates) => {
    set({
      banners: get().banners.map(b => b.id === id ? { ...b, ...updates } : b)
    });
  },
  
  deleteBanner: (id) => {
    set({ banners: get().banners.filter(b => b.id !== id) });
  },
  
  reorderBanners: (banners) => {
    set({ banners: banners.map((b, idx) => ({ ...b, order: idx + 1 })) });
  }
}));

export const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  login: (email, password) => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      set({ user: userWithoutPassword, isLoggedIn: true });
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  },
  register: (email, firstName, lastName, password) => {
    if (mockUsers.find(u => u.email === email)) {
      return false;
    }
    const newUser = {
      id: mockUsers.length + 1,
      email,
      password,
      firstName,
      lastName,
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isAdmin: false
    };
    mockUsers.push(newUser);
    const { password: pwd, ...userWithoutPassword } = newUser;
    set({ user: userWithoutPassword, isLoggedIn: true });
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    return true;
  },
  logout: () => {
    set({ user: null, isLoggedIn: false });
    localStorage.removeItem('user');
  },
  initializeAuth: () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      set({ user, isLoggedIn: true });
    }
  }
}));

export const useCartStore = create((set, get) => ({
  items: [],
  addItem: (product, quantity = 1) => {
    const items = get().items;
    const existingItem = items.find(item => item.id === product.id);
    if (existingItem) {
      set({
        items: items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      });
    } else {
      set({ items: [...items, { ...product, quantity }] });
    }
  },
  removeItem: (productId) => {
    set({ items: get().items.filter(item => item.id !== productId) });
  },
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
    } else {
      set({
        items: get().items.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      });
    }
  },
  clearCart: () => {
    set({ items: [] });
  },
  getTotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  }
}));

export const useProductStore = create((set, get) => ({
  products: mockProducts,
  filteredProducts: mockProducts,
  searchTerm: '',
  selectedCategory: 'all',
  categories: ['Laptops', 'Mobile Phones', 'Accessories', 'Electronics', 'Fashion', 'Home'],
  setProducts: (products) => {
    set({ products });
  },
  addCategory: (categoryName) => {
    const trimmedName = categoryName.trim();
    if (!trimmedName) return { success: false, message: 'Category name cannot be empty' };
    
    const exists = get().categories.some(cat => cat.toLowerCase() === trimmedName.toLowerCase());
    if (exists) {
      return { success: false, message: 'Category already exists' };
    }
    
    set({ categories: [...get().categories, trimmedName] });
    return { success: true, message: 'Category added successfully' };
  },
  deleteCategory: (categoryName) => {
    // Check if any products use this category
    const hasProducts = get().products.some(p => p.category === categoryName);
    if (hasProducts) {
      return { success: false, message: 'Cannot delete category with existing products' };
    }
    
    set({ categories: get().categories.filter(cat => cat !== categoryName) });
    return { success: true, message: 'Category deleted successfully' };
  },
  getCategories: () => {
    return get().categories;
  },
  addProduct: (product) => {
    const newProduct = {
      ...product,
      id: Math.max(...get().products.map(p => p.id)) + 1
    };
    set({ products: [...get().products, newProduct] });
    return newProduct;
  },
  updateProduct: (id, updates) => {
    set({
      products: get().products.map(p =>
        p.id === id ? { ...p, ...updates } : p
      )
    });
  },
  deleteProduct: (id) => {
    set({ products: get().products.filter(p => p.id !== id) });
  },
  filterProducts: (searchTerm, category) => {
    const products = get().products;
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    set({ filteredProducts: filtered, searchTerm, selectedCategory: category || 'all' });
  },
  getProductById: (id) => {
    return get().products.find(p => p.id === id);
  }
}));

export const useOrderStore = create((set, get) => ({
  orders: mockOrders,
  addOrder: (order) => {
    const newOrder = {
      ...order,
      id: `ORD-${String(mockOrders.length + 1).padStart(3, '0')}`,
      timeline: [
        { status: 'Order Placed', date: new Date().toLocaleString(), completed: true },
        order.paymentType === 'prepaid' ? { status: 'Payment Confirmed', date: new Date().toLocaleString(), completed: true } : null,
        { status: 'Processing', date: '', completed: false },
        { status: 'Shipped', date: '', completed: false },
        { status: 'Out for Delivery', date: '', completed: false },
        { status: 'Delivered', date: '', completed: false }
      ].filter(Boolean)
    };
    set({ orders: [...get().orders, newOrder] });
    return newOrder;
  },
  updateOrderStatus: (orderId, status) => {
    set({
      orders: get().orders.map(o =>
        o.id === orderId ? { ...o, status } : o
      )
    });
  },
  cancelOrder: (orderId, reason) => {
    const order = get().orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found' };

    // Check if order can be cancelled
    if (order.status === 'delivered') {
      return { success: false, message: 'Delivered orders cannot be cancelled' };
    }

    if (order.status === 'shipped' && order.paymentType !== 'cod') {
      return { success: false, message: 'Shipped orders can only be cancelled if payment type is COD' };
    }

    // COD orders can be cancelled anytime before delivery
    // Prepaid orders can only be cancelled before shipping
    if (order.paymentType === 'prepaid' && order.status === 'shipped') {
      return { success: false, message: 'Prepaid orders cannot be cancelled after shipping. Please contact support for refund.' };
    }

    set({
      orders: get().orders.map(o =>
        o.id === orderId
          ? {
              ...o,
              status: 'cancelled',
              cancelledAt: new Date().toISOString(),
              cancellationReason: reason,
              refundStatus: o.paymentType === 'prepaid' ? 'pending' : 'not_applicable',
              refundAmount: o.paymentType === 'prepaid' ? o.total : 0
            }
          : o
      )
    });

    return {
      success: true,
      message: order.paymentType === 'prepaid'
        ? 'Order cancelled successfully. Refund will be processed within 5-7 business days.'
        : 'Order cancelled successfully.'
    };
  },
  getOrdersByUserId: (userId) => {
    return get().orders.filter(o => o.userId === userId);
  },
  getOrderById: (orderId) => {
    return get().orders.find(o => o.id === orderId);
  }
}));

export const useUserStore = create((set, get) => ({
  users: mockUsers,
  addUser: (user) => {
    const newUser = {
      ...user,
      id: Math.max(...get().users.map(u => u.id)) + 1
    };
    set({ users: [...get().users, newUser] });
    return newUser;
  },
  updateUser: (id, updates) => {
    set({
      users: get().users.map(u =>
        u.id === id ? { ...u, ...updates } : u
      )
    });
  },
  deleteUser: (id) => {
    set({ users: get().users.filter(u => u.id !== id) });
  },
  getUserById: (id) => {
    return get().users.find(u => u.id === id);
  }
}));
