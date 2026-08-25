const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const cloudinary = require('../config/cloudinary');
const { expandToDescendants } = require('../utils/categoryTree');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Customers search by product-line name, not the internal Brand record —
// "galaxy" for a product whose Brand doc is literally named "Samsung",
// "pixel" for "Google". Each token is also checked against its synonyms'
// regexes when resolving brand/category matches.
const BRAND_SYNONYMS = {
  galaxy: ['samsung'],
  pixel: ['google'],
  airpods: ['apple'],
  ipad: ['apple'],
  iphone: ['apple'],
};

// Mongo's $text defaults to OR-across-words, which floods a query like
// "apple case" with every product matching either common word. Requiring
// every token to match somewhere relevant (name, description, or the name
// of the product's own brand/category) instead means "apple case" only
// returns products that are actually both Apple-branded and a case, even
// when neither word appears together in the title.
async function buildTokenSearchFilter(rawText) {
  const tokens = rawText.split(/\s+/).filter(Boolean).slice(0, 8);
  if (!tokens.length) return null;

  const [brands, categories] = await Promise.all([
    Brand.find({}, '_id name').lean(),
    Category.find({}, '_id name').lean(),
  ]);

  const andConditions = tokens.map((token) => {
    const re = new RegExp(escapeRegex(token), 'i');
    const synonymRegexes = (BRAND_SYNONYMS[token.toLowerCase()] || []).map((s) => new RegExp(escapeRegex(s), 'i'));
    const anyMatches = (name) => re.test(name) || synonymRegexes.some((s) => s.test(name));

    const matchingCategoryIds = categories.filter((c) => anyMatches(c.name)).map((c) => c._id);
    const matchingBrandIds = brands.filter((b) => anyMatches(b.name)).map((b) => b._id);
    const or = [{ name: re }, { description: re }];
    if (matchingCategoryIds.length) or.push({ category: { $in: matchingCategoryIds } });
    if (matchingBrandIds.length) or.push({ brand: { $in: matchingBrandIds } });
    return { $or: or };
  });

  return { tokens, filter: { $and: andConditions } };
}

// Rank matches with a name hit above a match buried only in the description
// or reached via brand/category — a search result named "iPhone 15 Case"
// should outrank one that just happens to have "case" in its description.
function scoreByTokenRelevance(doc, tokens) {
  const name = doc.name.toLowerCase();
  const description = doc.description.toLowerCase();
  let score = 0;
  for (const token of tokens) {
    const t = token.toLowerCase();
    if (name.includes(t)) score += 3;
    else if (description.includes(t)) score += 1;
  }
  return score;
}

const getProducts = async (req, res) => {
  try {
    const { category, brand, condition, minPrice, maxPrice, search, page, limit, isFeatured } = req.query;

    const filter = {};

    if (category) {
      const flatCategories = await Category.find({}, '_id parent').lean();
      filter.category = { $in: expandToDescendants(flatCategories, category) };
    }
    if (brand) filter.brand = brand;
    if (condition) filter.condition = condition;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const trimmedSearch = search && search.trim();
    let products, total;

    if (trimmedSearch) {
      const built = await buildTokenSearchFilter(trimmedSearch);
      const searchFilter = built ? { ...filter, ...built.filter } : filter;

      // Small catalog (a few thousand products) — score+sort in the app
      // rather than reach for a full aggregation pipeline for relevance.
      const candidates = await Product.find(searchFilter, 'name description').lean();
      const ranked = candidates
        .map((c) => ({ id: c._id, score: scoreByTokenRelevance(c, built?.tokens ?? []) }))
        .sort((a, b) => b.score - a.score);

      total = ranked.length;
      const pageIds = ranked.slice(skip, skip + limitNum).map((r) => r.id);
      const pageDocs = await Product.find({ _id: { $in: pageIds } })
        .populate('brand', 'name slug')
        .populate('category', 'name slug');
      const byId = new Map(pageDocs.map((d) => [String(d._id), d]));
      products = pageIds.map((id) => byId.get(String(id))).filter(Boolean);
    } else {
      [products, total] = await Promise.all([
        Product.find(filter)
          .populate('brand', 'name slug')
          .populate('category', 'name slug')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum),
        Product.countDocuments(filter),
      ]);
    }

    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (err) {
    console.error('getProducts:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProductFacets = async (req, res) => {
  try {
    const [result] = await Product.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          byCategory: [{ $group: { _id: '$category', count: { $sum: 1 } } }],
          byBrand: [{ $group: { _id: '$brand', count: { $sum: 1 } } }],
          byCondition: [{ $group: { _id: '$condition', count: { $sum: 1 } } }],
          byCategoryBrand: [{ $group: { _id: { category: '$category', brand: '$brand' }, count: { $sum: 1 } } }],
        },
      },
    ]);

    const toMap = (rows) => Object.fromEntries(rows.map((r) => [String(r._id), r.count]));

    const categoryBrand = {};
    for (const r of result.byCategoryBrand) {
      const catId = String(r._id.category);
      const brandId = String(r._id.brand);
      if (!categoryBrand[catId]) categoryBrand[catId] = {};
      categoryBrand[catId][brandId] = r.count;
    }

    res.json({
      total: result.total[0]?.count ?? 0,
      categories: toMap(result.byCategory),
      brands: toMap(result.byBrand),
      condition: toMap(result.byCondition),
      categoryBrand,
    });
  } catch (err) {
    console.error('getProductFacets:', err);
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
    console.error('getProductById:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, brand, condition, stock, isFeatured } = req.body;

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

    const images = req.files ? req.files.map((f) => f.path) : [];

    const product = new Product({ name, description, price, category, brand, condition, stock, images, isFeatured });
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    console.error('createProduct:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, brand, condition, stock, isFeatured, removeImages } = req.body;

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
    if (isFeatured !== undefined) product.isFeatured = isFeatured;

    if (removeImages) {
      const toRemove = Array.isArray(removeImages) ? removeImages : [removeImages];
      product.images = product.images.filter((img) => !toRemove.includes(img));
    }

    if (req.files && req.files.length > 0) {
      const newUrls = req.files.map((f) => f.path);
      product.images = [...product.images, ...newUrls];
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.error('updateProduct:', err);
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
    console.error('deleteProduct:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ message: 'imageUrl is required' });
    }

    if (!product.images.includes(imageUrl)) {
      return res.status(404).json({ message: 'Image not found on this product' });
    }

    // Extract public_id from Cloudinary URL
    // URL: https://res.cloudinary.com/{cloud}/image/upload/v{ts}/{folder}/{file}.{ext}
    const afterUpload = imageUrl.split('/upload/')[1];
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    const publicId = withoutVersion.replace(/\.[^/.]+$/, '');

    await cloudinary.uploader.destroy(publicId);

    product.images = product.images.filter((img) => img !== imageUrl);
    await product.save();

    res.json({ message: 'Image deleted', images: product.images });
  } catch (err) {
    console.error('deleteProductImage:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProducts,
  getProductFacets,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
};
