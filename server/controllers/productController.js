const asyncHandler = require('../utils/asyncHandler');
const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.pageNumber) || 1;

  // 1. Keyword Filter (Name, Description, or Category Name)
  let keyword = {};
  if (req.query.keyword) {
    const searchRegex = { $regex: req.query.keyword, $options: 'i' };
    
    // Find categories matching the keyword to include them in the product search
    const matchingCategories = await Category.find({ name: searchRegex });
    const categoryIds = matchingCategories.map(c => c._id);

    keyword = {
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: { $in: categoryIds } }
      ]
    };
  }

  // 2. Category Filter (Handles ID or Slug/Name)
  let categoryFilter = {};
  if (req.query.category && req.query.category !== 'all' && req.query.category !== '') {
    if (mongoose.Types.ObjectId.isValid(req.query.category)) {
      categoryFilter = { category: req.query.category };
    } else {
      // Try to find by slug or name
      const foundCat = await Category.findOne({
        $or: [
          { slug: req.query.category.toLowerCase().trim() },
          { name: { $regex: new RegExp(`^${req.query.category.trim()}$`, 'i') } }
        ]
      });
      if (foundCat) {
        categoryFilter = { category: foundCat._id };
      } else {
        // Return empty if category provided but not found
        console.log(`Category not found: ${req.query.category}`);
        return res.json({ products: [], page: 1, pages: 0 });
      }
    }
  }

  // 3. Status Filters
  const isFeatured = req.query.isFeatured ? { isFeatured: req.query.isFeatured === 'true' } : {};
  const isTrending = req.query.isTrending ? { isTrending: req.query.isTrending === 'true' } : {};
  const isBestSeller = req.query.isBestSeller ? { isBestSeller: req.query.isBestSeller === 'true' } : {};
  const isNewArrival = req.query.isNewArrival ? { isNewArrival: req.query.isNewArrival === 'true' } : {};
  const isSignatureVault = req.query.isSignatureVault ? { isSignatureVault: req.query.isSignatureVault === 'true' } : {};

  // 4. Rating & Price Filters
  const rating = req.query.rating ? { ratings: { $gte: Number(req.query.rating) } } : {};
  const price = req.query.price 
    ? { price: { $lte: Number(req.query.price) } } 
    : {};

  // 5. Combine All Filters
  const query = { 
    ...keyword, 
    ...categoryFilter, 
    ...isFeatured, 
    ...isTrending, 
    ...isBestSeller, 
    ...isNewArrival, 
    ...isSignatureVault,
    ...rating, 
    ...price 
  };

  // 6. Sorting
  const sortOrder = req.query.sort === 'price_low' 
    ? { price: 1 } 
    : req.query.sort === 'price_high' 
    ? { price: -1 } 
    : req.query.sort === 'popular' 
    ? { ratings: -1 } 
    : req.query.sort === 'newest'
    ? { createdAt: -1 }
    : { createdAt: -1 }; // Default to newest first

  console.log('Product Query:', JSON.stringify(query));

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort(sortOrder);

  console.log(`Fetched ${products.length} products (Total: ${count})`);

  res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name');

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  let {
    name,
    price,
    description,
    images,
    category,
    stock,
    isFeatured,
    isTrending,
    isBestSeller,
    isNewArrival,
    isSignatureVault,
    specifications,
  } = req.body;

  // Normalize name
  name = name ? name.trim() : '';

  const product = new Product({
    name,
    price,
    user: req.user._id,
    images,
    category,
    stock,
    description,
    isFeatured: isFeatured === 'true' || isFeatured === true,
    isTrending: isTrending === 'true' || isTrending === true,
    isBestSeller: isBestSeller === 'true' || isBestSeller === true,
    isNewArrival: isNewArrival === 'true' || isNewArrival === true,
    isSignatureVault: isSignatureVault === 'true' || isSignatureVault === true,
    specifications,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  let {
    name,
    price,
    description,
    images,
    category,
    stock,
    isFeatured,
    isTrending,
    isBestSeller,
    isNewArrival,
    isSignatureVault,
    specifications,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name ? name.trim() : product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.images = images || product.images;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.isFeatured = isFeatured !== undefined ? (isFeatured === 'true' || isFeatured === true) : product.isFeatured;
    product.isTrending = isTrending !== undefined ? (isTrending === 'true' || isTrending === true) : product.isTrending;
    product.isBestSeller = isBestSeller !== undefined ? (isBestSeller === 'true' || isBestSeller === true) : product.isBestSeller;
    product.isNewArrival = isNewArrival !== undefined ? (isNewArrival === 'true' || isNewArrival === true) : product.isNewArrival;
    product.isSignatureVault = isSignatureVault !== undefined ? (isSignatureVault === 'true' || isSignatureVault === true) : product.isSignatureVault;
    product.specifications = specifications || product.specifications;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment, images } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      images: images || [],
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numOfReviews = product.reviews.length;

    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ ratings: -1 }).limit(3);
  res.json(products);
});

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
