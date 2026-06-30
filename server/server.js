require('dotenv').config({ override: true });
const dns = require('dns');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const productRoutes = require('./routes/productRoutes');
const Category = require('./models/Category');
const Brand = require('./models/Brand');

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  try {
    await Promise.all([Category.syncIndexes(), Brand.syncIndexes()]);
    console.log('Indexes synced');
  } catch (err) {
    console.error('Index sync failed:', err);
  }
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
