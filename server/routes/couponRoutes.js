const express = require('express');
const router = express.Router();
const {
  createCoupon,
  getCoupons,
  validateCoupon,
  deleteCoupon,
  toggleCouponStatus,
} = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, admin, createCoupon)
  .get(protect, admin, getCoupons);

router.post('/validate', validateCoupon);

router.route('/:id')
  .delete(protect, admin, deleteCoupon);

router.put('/:id/toggle', protect, admin, toggleCouponStatus);

module.exports = router;
