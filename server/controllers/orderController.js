import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { generateInvoicePDFBuffer } from '../services/invoiceService.js';
import { sendInvoiceEmail, sendOrderConfirmationEmail } from '../services/emailService.js';

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

    // Populate user for invoice generation
    await order.populate('user', 'firstName lastName email phone');

    // Generate and send invoice email + order confirmation (non-blocking)
    setImmediate(async () => {
      try {
        // Send order confirmation email
        await sendOrderConfirmationEmail(req.user.email, {
          orderId: order._id,
          firstName: req.user.firstName,
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          total,
          shippingAddress,
          paymentMethod
        });
        console.log(`✅ Order confirmation email sent for order ${order._id}`);

        // Send invoice email with PDF
        const pdfBuffer = await generateInvoicePDFBuffer(order);
        await sendInvoiceEmail(req.user.email, pdfBuffer, order._id);
        console.log(`✅ Invoice email sent for order ${order._id}`);
      } catch (emailError) {
        console.error(`❌ Failed to send emails for order ${order._id}:`, emailError.message);
        // Don't fail the order creation if email fails
      }
    });

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

// @desc    Get order invoice (download PDF)
// @route   GET /api/orders/:id/invoice
// @access  Private
export const getOrderInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to download this invoice' });
    }

    // Generate PDF
    const pdfBuffer = await generateInvoicePDFBuffer(order);

    // Set response headers for PDF download
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Invoice-${order._id}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Invoice generation error:', error);
    res.status(500).json({ message: 'Error generating invoice: ' + error.message });
  }
};
