const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  console.log('[protect] raw Authorization header:', authHeader);

  const token = authHeader.split(' ')[1];
  console.log('[protect] extracted token:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('[protect] jwt.verify error — name:', err.name, '| message:', err.message);
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

// Tries to attach req.user from a Bearer token but never rejects the request.
// Used on public routes where auth is optional (e.g. buy/sell, unlock submissions).
const optionalProtect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (_) {
      // Invalid token — treat as guest, do not reject
    }
  }
  next();
};

module.exports = { protect, optionalProtect };
