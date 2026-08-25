const Category = require('../models/Category');
const Product = require('../models/Product');
const { buildChildrenMap } = require('../utils/categoryTree');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error('getCategories:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    console.error('getCategoryById:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

function attachChildren(node, byParent) {
  const children = (byParent.get(String(node._id)) || [])
    .sort((a, b) => {
      if (a.navOrder != null && b.navOrder != null) return a.navOrder - b.navOrder;
      if (a.navOrder != null) return -1;
      if (b.navOrder != null) return 1;
      return a.name.localeCompare(b.name);
    })
    .map((child) => attachChildren(child, byParent));
  return { ...node, children };
}

const getCategoryTree = async (req, res) => {
  try {
    const flat = await Category.find().lean();
    const byParent = buildChildrenMap(flat);
    const roots = (byParent.get('root') || [])
      .sort((a, b) => {
        if (a.navOrder != null && b.navOrder != null) return a.navOrder - b.navOrder;
        if (a.navOrder != null) return -1;
        if (b.navOrder != null) return 1;
        return a.name.localeCompare(b.name);
      })
      .map((root) => attachChildren(root, byParent));
    res.json(roots);
  } catch (err) {
    console.error('getCategoryTree:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const resolveCategoryPath = async (req, res) => {
  try {
    const path = String(req.query.path || '')
      .split('/')
      .map((seg) => seg.trim())
      .filter(Boolean);
    if (!path.length) {
      return res.status(400).json({ message: 'path is required' });
    }
    let parent = null;
    const ancestors = [];
    let current = null;
    for (const slug of path) {
      current = await Category.findOne({ parent, slug });
      if (!current) {
        return res.status(404).json({ message: 'Category not found' });
      }
      ancestors.push(current);
      parent = current._id;
    }
    res.json({ category: current, ancestors });
  } catch (err) {
    console.error('resolveCategoryPath:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, parent, navOrder } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (parent) {
      const parentExists = await Category.findById(parent);
      if (!parentExists) {
        return res.status(400).json({ message: 'Parent category not found' });
      }
    }
    const category = new Category({ name, parent: parent || null, navOrder: navOrder ?? null });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Category already exists' });
    }
    console.error('createCategory:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, parent, navOrder } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    if (name !== undefined) {
      category.name = name;
    }
    if (parent !== undefined) {
      category.parent = parent || null;
    }
    if (navOrder !== undefined) {
      category.navOrder = navOrder;
    }
    await category.save();
    res.json(category);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Category already exists' });
    }
    console.error('updateCategory:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const [childCount, productCount] = await Promise.all([
      Category.countDocuments({ parent: id }),
      Product.countDocuments({ category: id }),
    ]);
    if (childCount > 0) {
      return res.status(400).json({ message: 'Category has subcategories; reassign or delete them first' });
    }
    if (productCount > 0) {
      return res.status(400).json({ message: 'Category has products; reassign them first' });
    }
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error('deleteCategory:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  getCategoryTree,
  resolveCategoryPath,
  createCategory,
  updateCategory,
  deleteCategory,
};
