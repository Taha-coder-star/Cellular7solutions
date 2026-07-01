const mongoose = require('mongoose');

const buySellRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  device: {
    type: String,
    required: true,
    trim: true,
  },
  condition: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  images: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'accepted', 'rejected'],
    default: 'pending',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('BuySellRequest', buySellRequestSchema);
