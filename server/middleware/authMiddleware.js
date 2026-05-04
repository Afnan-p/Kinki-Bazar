const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

// @desc    Protect routes with JWT authentication
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user and attach to request
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user account not found');
      }

      req.user = user;
      return next(); // Explicitly return next()
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      res.status(401);
      throw new Error('Not authorized, token validation failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no session token provided');
  }
});

// @desc    Admin middleware to restrict access to admin users only
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403); // Use 403 Forbidden for role issues
    throw new Error('Access denied: Admin privileges required');
  }
};

module.exports = { protect, admin };
