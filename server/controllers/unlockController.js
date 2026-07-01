const UnlockRequest = require('../models/UnlockRequest');

const createUnlockRequest = async (req, res) => {
  try {
    const { name, phone, device, imei, carrier } = req.body;

    if (!name || !phone || !device || !carrier) {
      return res.status(400).json({ message: 'name, phone, device, and carrier are required' });
    }

    const request = new UnlockRequest({
      name,
      phone,
      device,
      imei,
      carrier,
      user: req.user ? req.user.id : undefined,
    });

    await request.save();
    res.status(201).json(request);
  } catch (err) {
    console.error('createUnlockRequest:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUnlockRequests = async (req, res) => {
  try {
    const requests = await UnlockRequest.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('getUnlockRequests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUnlockRequestById = async (req, res) => {
  try {
    const request = await UnlockRequest.findById(req.params.id).populate('user', 'name email');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(request);
  } catch (err) {
    console.error('getUnlockRequestById:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUnlockStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'in-progress', 'completed', 'rejected'];

    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${allowed.join(', ')}` });
    }

    const request = await UnlockRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    await request.save();
    res.json(request);
  } catch (err) {
    console.error('updateUnlockStatus:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createUnlockRequest,
  getUnlockRequests,
  getUnlockRequestById,
  updateUnlockStatus,
};
