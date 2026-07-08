const mongoose = require('mongoose');

const repairRequestSchema = new mongoose.Schema({
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
  address: {
    type: String,
    required: true,
    trim: true,
  },
  deviceType: {
    type: String,
    required: true,
    trim: true,
  },
  issue: {
    type: String,
    required: true,
    trim: true,
  },
  availableDate: {
    type: Date,
    required: true,
  },
  availableTime: {
    type: String,
    required: true,
    trim: true,
  },
  images: {
    type: [String],
    default: [],
  },
  agreedToTerms: {
    type: Boolean,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  adminNotes: {
    type: String,
    trim: true,
  },
  assignedTechnician: {
    type: String,
    trim: true,
  },
  estimatedCost: {
    type: Number,
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

repairRequestSchema.pre('save', function () {
  if (!this.agreedToTerms) {
    throw new Error('Customer must agree to terms before submitting a repair request.');
  }
});

module.exports = mongoose.model('RepairRequest', repairRequestSchema);
