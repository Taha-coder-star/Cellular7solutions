const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(401).json({ message: 'Either username or password is wrong' });
    }

    const match = await admin.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: 'Either username or password is wrong' });
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { adminLogin };
