const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.route('/')
  .get(getCategories)
  .post(protect, admin, upload.single('image'), createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(protect, admin, upload.single('image'), updateCategory)
  .delete(protect, admin, deleteCategory);

module.exports = router;
