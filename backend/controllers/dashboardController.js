const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const TripInquiry = require('../models/TripInquiry');
const Expense = require('../models/Expense');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Manager, Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalVehicles,
      activeVehicles,
      totalDrivers,
      availableDrivers,
      pendingInquiries,
      activeTrips,
      completedTrips,
      totalExpenseResult,
    ] = await Promise.all([
      Vehicle.countDocuments(),
      Vehicle.countDocuments({ status: 'active' }),
      Driver.countDocuments(),
      Driver.countDocuments({ status: 'available' }),
      TripInquiry.countDocuments({ status: 'pending' }),
      Trip.countDocuments({ status: 'in-progress' }),
      Trip.countDocuments({ status: 'completed' }),
      Expense.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
    ]);

    // Trip stats by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const tripsByMonth = await Trip.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
          distance: { $sum: '$totalDistance' },
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Expense by type
    const expenseByType = await Expense.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Recent trips
    const recentTrips = await Trip.find()
      .populate('vehicle', 'vehicleNumber model')
      .populate('driver', 'name')
      .populate({
        path: 'inquiry',
        select: 'pickupLocation dropLocation',
      })
      .sort('-createdAt')
      .limit(5);

    res.json({
      stats: {
        totalVehicles,
        activeVehicles,
        totalDrivers,
        availableDrivers,
        pendingInquiries,
        activeTrips,
        completedTrips,
        totalExpense: totalExpenseResult.length > 0 ? totalExpenseResult[0].total : 0,
      },
      tripsByMonth,
      expenseByType,
      recentTrips,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
