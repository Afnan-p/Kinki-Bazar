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
  generate2FA,
  enable2FA,
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

router.post('/2fa/generate', protect, generate2FA);
router.post('/2fa/enable', protect, enable2FA);

module.exports = router;
