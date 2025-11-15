import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      total
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Verify product availability and stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}` 
        });
      }
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      total,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Completed'
    });

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name image');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name image');

    if (order) {
      // Check if user owns this order or is admin
      if (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin) {
        res.json(order);
      } else {
        res.status(403).json({ message: 'Not authorized to view this order' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name image');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;

    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status || order.status;
      
      if (trackingNumber) {
        order.trackingNumber = trackingNumber;
      }

      if (status === 'delivered') {
        order.deliveredAt = Date.now();
        order.paymentStatus = 'Completed';
      }

      if (status === 'cancelled') {
        order.cancelledAt = Date.now();
        
        // Restore product stock
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity }
          });
        }
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Can only cancel pending or processing orders
    if (order.status === 'shipped' || order.status === 'delivered') {
      return res.status(400).json({ 
        message: 'Cannot cancel shipped or delivered orders' 
      });
    }

    // COD orders can be cancelled anytime before shipment
    if (order.paymentMethod === 'Cash on Delivery' && order.status !== 'shipped') {
      order.status = 'cancelled';
      order.cancelledAt = Date.now();

      // Restore product stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }

      await order.save();
      return res.json({ message: 'Order cancelled successfully', order });
    }

    // Prepaid orders can be cancelled before shipping
    if (order.status === 'pending' || order.status === 'processing') {
      order.status = 'cancelled';
      order.cancelledAt = Date.now();
      order.paymentStatus = 'Refunded';

      // Restore product stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }

      await order.save();
      return res.json({ 
        message: 'Order cancelled. Refund will be processed within 5-7 business days.', 
        order 
      });
    }

    res.status(400).json({ message: 'Cannot cancel this order' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
