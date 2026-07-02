const RepairRequest = require('../models/RepairRequest');

const createRepairRequest = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      deviceType,
      issue,
      availableDate,
      availableTime,
      images,
      agreedToTerms,
    } = req.body;

    if (!name || !phone || !address || !deviceType || !issue || !availableDate || !availableTime) {
      return res.status(400).json({
        message: 'name, phone, address, deviceType, issue, availableDate, and availableTime are required',
      });
    }

    if (!agreedToTerms) {
      return res.status(400).json({
        message: 'Customer must agree to terms before submitting a repair request.',
      });
    }

    const request = new RepairRequest({
      name,
      phone,
      address,
      deviceType,
      issue,
      availableDate,
      availableTime,
      images: images || [],
      agreedToTerms: true,
      user: req.user ? req.user.id : undefined,
    });

    await request.save();
    res.status(201).json(request);
  } catch (err) {
    console.error('createRepairRequest:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getRepairRequests = async (req, res) => {
  try {
    const requests = await RepairRequest.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('getRepairRequests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyRepairRequests = async (req, res) => {
  try {
    const requests = await RepairRequest.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('getMyRepairRequests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getRepairRequestById = async (req, res) => {
  try {
    const request = await RepairRequest.findById(req.params.id).populate('user', 'name email');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(request);
  } catch (err) {
    console.error('getRepairRequestById:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateRepair = async (req, res) => {
  try {
    const { status, assignedTechnician, estimatedCost, adminNotes } = req.body;

    const allowed = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${allowed.join(', ')}` });
    }

    const request = await RepairRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (status !== undefined) request.status = status;
    if (assignedTechnician !== undefined) request.assignedTechnician = assignedTechnician;
    if (estimatedCost !== undefined) request.estimatedCost = estimatedCost;
    if (adminNotes !== undefined) request.adminNotes = adminNotes;

    await request.save();
    res.json(request);
  } catch (err) {
    console.error('updateRepair:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createRepairRequest,
  getRepairRequests,
  getMyRepairRequests,
  getRepairRequestById,
  updateRepair,
};
