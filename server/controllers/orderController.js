const mongoose = require('mongoose');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');

const placeOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, shippingPrice = 0 } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city
    ) {
      return res.status(400).json({
        message: 'shippingAddress with fullName, phone, address, and city is required',
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: 'paymentMethod is required' });
    }

    // Fetch all referenced products in a single query
    const productIds = orderItems.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    // Validate stock for every item before writing anything.
    // If any single item fails we return immediately — no stock has been touched yet.
    for (const item of orderItems) {
      const product = productMap.get(String(item.product));
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.product}` });
      }
      if (item.quantity < 1) {
        return res.status(400).json({ message: `Quantity must be at least 1 for "${product.name}"` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.name}". Requested: ${item.quantity}, available: ${product.stock}`,
        });
      }
    }

    // All items are valid — deduct stock
    for (const item of orderItems) {
      const product = productMap.get(String(item.product));
      product.stock -= item.quantity;
      await product.save();
    }

    // Pre-generate the order ID so OrderItems can store the back-reference at creation time
    const orderId = new mongoose.Types.ObjectId();

    const orderItemDocs = orderItems.map((item) => {
      const product = productMap.get(String(item.product));
      return {
        order: orderId,
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        price: product.price,
        quantity: item.quantity,
      };
    });

    const createdItems = await OrderItem.insertMany(orderItemDocs);

    // Calculate totals server-side — client-sent prices are never trusted
    const itemsPrice = createdItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalPrice = itemsPrice + Number(shippingPrice);

    const order = await Order.create({
      _id: orderId,
      user: req.user.id,
      orderItems: createdItems.map((i) => i._id),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice: Number(shippingPrice),
      totalPrice,
    });

    const populated = await Order.findById(order._id).populate('orderItems');
    res.status(201).json(populated);
  } catch (err) {
    console.error('placeOrder:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('orderItems')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('getMyOrders:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorised to view this order' });
    }

    res.json(order);
  } catch (err) {
    console.error('getOrderById:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${allowed.join(', ')}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error('updateOrderStatus:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      updateTime: req.body.updateTime,
      email: req.body.email,
    };

    await order.save();
    res.json(order);
  } catch (err) {
    console.error('updateOrderToPaid:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderToPaid,
};
