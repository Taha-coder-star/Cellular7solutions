require('dotenv').config({ override: true });
const dns = require('dns');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const connectDB = require('./config/db');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const buySellRoutes = require('./routes/buySellRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const repairRoutes = require('./routes/repairRoutes');
const Category = require('./models/Category');
const Brand = require('./models/Brand');
const Review = require('./models/Review');

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const app = express();

// Render/Vercel terminate TLS at their edge and forward over HTTP with
// X-Forwarded-* headers — trust the first hop so req.secure and express-rate-limit
// see the real client IP/protocol instead of the proxy's.
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
    }
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
    next();
  });
}

app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/admin', adminAuthRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/buysell', buySellRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/repairs', repairRoutes);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || /image files.*are allowed/.test(err.message || '')) {
    return res.status(400).json({ message: err.message });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  try {
    await Promise.all([Category.syncIndexes(), Brand.syncIndexes(), Review.syncIndexes()]);
    console.log('Indexes synced');
  } catch (err) {
    console.error('Index sync failed:', err);
  }
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
