const asyncHandler = require('../utils/asyncHandler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const usersCount = await User.countDocuments({});
  const productsCount = await Product.countDocuments({});
  const ordersCount = await Order.countDocuments({});
  
  const orders = await Order.find({});
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  // Get monthly sales data for the last 7 months
  const monthlySales = await Order.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        revenue: { $sum: "$totalPrice" },
        sales: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  // Map month numbers to names
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartData = monthlySales.map(item => ({
    name: monthNames[item._id - 1],
    revenue: item.revenue,
    sales: item.sales
  }));

  // Get recent orders
  const recentOrders = await Order.find({})
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    usersCount,
    productsCount,
    ordersCount,
    totalRevenue,
    chartData,
    recentOrders
  });
});

module.exports = {
  getDashboardStats
};
