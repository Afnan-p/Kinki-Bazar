const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const { upload } = require('../config/cloudinary');

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('image'), updateUserProfile);

router
  .route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.delete('/wishlist/:id', protect, removeFromWishlist);

module.exports = router;
