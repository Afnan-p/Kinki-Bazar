const asyncHandler = require('../utils/asyncHandler');
const Category = require('../models/Category');

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  let { name, description, isFeatured } = req.body;

  // Normalize name
  name = name.trim();
  
  const categoryExists = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const categoryData = {
    name,
    description,
    isFeatured: isFeatured === 'true' || isFeatured === true,
    slug: name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
  };

  // If image is uploaded via Cloudinary middleware
  if (req.file) {
    categoryData.image = {
      url: req.file.path,
      public_id: req.file.filename
    };
  }

  const category = await Category.create(categoryData);
  res.status(201).json(category);
});

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: -1 });
  res.json(categories);
});

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  let { name, description, isFeatured } = req.body;

  const category = await Category.findById(req.params.id);

  if (category) {
    if (name) {
      name = name.trim();
      // Check if another category already has this name
      const categoryExists = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      if (categoryExists) {
        res.status(400);
        throw new Error('Another category already has this name');
      }
      category.name = name;
      category.slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    
    category.description = description !== undefined ? description : category.description;
    category.isFeatured = isFeatured !== undefined ? (isFeatured === 'true' || isFeatured === true) : category.isFeatured;

    if (req.file) {
      category.image = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
