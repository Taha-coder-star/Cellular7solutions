const Brand = require('../models/Brand');

const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json(brand);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createBrand = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const brand = new Brand({ name });
    await brand.save();
    res.status(201).json(brand);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Brand already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const updateBrand = async (req, res) => {
  try {
    const { name } = req.body;
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    if (name !== undefined) {
      brand.name = name;
    }
    await brand.save();
    res.json(brand);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Brand already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json({ message: 'Brand deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};
