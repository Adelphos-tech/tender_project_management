const Trip = require('../models/Trip');
const Expense = require('../models/Expense');
const mongoose = require('mongoose');

// @desc    Get report summary
// @route   GET /api/reports/summary
// @access  Manager, Admin
exports.getReportSummary = async (req, res) => {
  try {
    const { startDate, endDate, vehicleId, driverId } = req.query;
    const matchStage = { status: 'completed' };

    if (startDate || endDate) {
      matchStage.completedAt = {};
      if (startDate) matchStage.completedAt.$gte = new Date(startDate);
      if (endDate) matchStage.completedAt.$lte = new Date(endDate);
    }
    if (vehicleId) matchStage.vehicle = new mongoose.Types.ObjectId(vehicleId);
    if (driverId) matchStage.driver = new mongoose.Types.ObjectId(driverId);

    const summary = await Trip.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalTrips: { $sum: 1 },
          totalDistance: { $sum: '$totalDistance' },
          totalExpense: { $sum: '$totalExpense' },
          avgCostPerKM: { $avg: '$costPerKM' },
        }
      }
    ]);

    const result = summary.length > 0 ? summary[0] : {
      totalTrips: 0,
      totalDistance: 0,
      totalExpense: 0,
      avgCostPerKM: 0,
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get detailed reports
// @route   GET /api/reports/detailed
// @access  Manager, Admin
exports.getDetailedReport = async (req, res) => {
  try {
    const { startDate, endDate, vehicleId, driverId } = req.query;
    const query = { status: 'completed' };

    if (startDate || endDate) {
      query.completedAt = {};
      if (startDate) query.completedAt.$gte = new Date(startDate);
      if (endDate) query.completedAt.$lte = new Date(endDate);
    }
    if (vehicleId) query.vehicle = vehicleId;
    if (driverId) query.driver = driverId;

    const trips = await Trip.find(query)
      .populate({
        path: 'inquiry',
        select: 'pickupLocation dropLocation dateTime',
        populate: { path: 'createdBy', select: 'name' },
      })
      .populate('vehicle', 'vehicleNumber model type')
      .populate('driver', 'name phone')
      .sort('-completedAt');

    // Get expense breakdown by type
    const tripIds = trips.map(t => t._id);
    const expenseBreakdown = await Expense.aggregate([
      { $match: { trip: { $in: tripIds } } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        }
      }
    ]);

    // Monthly summary
    const monthlySummary = await Trip.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: '$completedAt' },
            month: { $month: '$completedAt' },
          },
          trips: { $sum: 1 },
          distance: { $sum: '$totalDistance' },
          expense: { $sum: '$totalExpense' },
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    res.json({
      trips,
      expenseBreakdown,
      monthlySummary,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
