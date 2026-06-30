const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');

const getProducts = async (req, res) => {
  try {
    const { category, brand, condition, minPrice, maxPrice, search, page, limit } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (condition) filter.condition = condition;

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    if (search) filter.name = { $regex: search, $options: 'i' };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('brand', 'name slug');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, brand, condition, stock, images, isFeatured } = req.body;

    if (!name || !description || price === undefined || !category || !brand || !condition) {
      return res.status(400).json({ message: 'name, description, price, category, brand, and condition are required' });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Category not found' });
    }

    const brandExists = await Brand.findById(brand);
    if (!brandExists) {
      return res.status(400).json({ message: 'Brand not found' });
    }

    const product = new Product({ name, description, price, category, brand, condition, stock, images, isFeatured });
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, brand, condition, stock, images, isFeatured } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (category !== undefined) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Category not found' });
      }
    }

    if (brand !== undefined) {
      const brandExists = await Brand.findById(brand);
      if (!brandExists) {
        return res.status(400).json({ message: 'Brand not found' });
      }
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (brand !== undefined) product.brand = brand;
    if (condition !== undefined) product.condition = condition;
    if (stock !== undefined) product.stock = stock;
    if (images !== undefined) product.images = images;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
