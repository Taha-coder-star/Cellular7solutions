const BuySellRequest = require('../models/BuySellRequest');

const createBuySellRequest = async (req, res) => {
  try {
    const { name, phone, device, condition, description, images } = req.body;

    if (!name || !phone || !device || !condition) {
      return res.status(400).json({ message: 'name, phone, device, and condition are required' });
    }

    const request = new BuySellRequest({
      name,
      phone,
      device,
      condition,
      description,
      images: images || [],
      user: req.user ? req.user.id : undefined,
    });

    await request.save();
    res.status(201).json(request);
  } catch (err) {
    console.error('createBuySellRequest:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBuySellRequests = async (req, res) => {
  try {
    const requests = await BuySellRequest.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('getBuySellRequests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBuySellRequestById = async (req, res) => {
  try {
    const request = await BuySellRequest.findById(req.params.id).populate('user', 'name email');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(request);
  } catch (err) {
    console.error('getBuySellRequestById:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateBuySellStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'reviewing', 'accepted', 'rejected'];

    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${allowed.join(', ')}` });
    }

    const request = await BuySellRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    await request.save();
    res.json(request);
  } catch (err) {
    console.error('updateBuySellStatus:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBuySellRequest,
  getBuySellRequests,
  getBuySellRequestById,
  updateBuySellStatus,
};
