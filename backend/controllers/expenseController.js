const Expense = require('../models/Expense');
const Trip = require('../models/Trip');
const { uploadToCloudinary } = require('../middleware/upload');
const { validationResult } = require('express-validator');

// @desc    Add expense to trip
// @route   POST /api/expenses
// @access  Driver, Manager, Admin
exports.createExpense = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tripId, vehicleId, type, amount, description, date } = req.body;

    if (!tripId && !vehicleId) {
      return res.status(400).json({ message: 'Must provide either a Trip ID or Vehicle ID' });
    }

    let trip = null;
    if (tripId) {
      // Verify trip exists and is in-progress
      trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      if (trip.status !== 'in-progress') {
        return res.status(400).json({ message: 'Expenses can only be added to in-progress trips' });
      }
    }

    let billImage = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'trip-expenses');
      billImage = result.secure_url;
    }

    const expenseObj = {
      type,
      amount,
      description,
      date: date || new Date(),
      billImage,
      addedBy: req.user._id,
    };
    if (tripId) expenseObj.trip = tripId;
    if (vehicleId) expenseObj.vehicle = vehicleId;

    const expense = await Expense.create(expenseObj);

    // Update trip total expense if this is a trip expense
    if (trip) {
      const totalExpense = await Expense.aggregate([
        { $match: { trip: trip._id } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      
      trip.totalExpense = totalExpense.length > 0 ? totalExpense[0].total : 0;
      if (trip.totalDistance > 0) {
        trip.costPerKM = Math.round((trip.totalExpense / trip.totalDistance) * 100) / 100;
      }
      await trip.save();
    }

    const populated = await Expense.findById(expense._id).populate('addedBy', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get expenses (by trip or all)
// @route   GET /api/expenses
// @access  Driver, Manager, Admin
exports.getExpenses = async (req, res) => {
  try {
    const { tripId, vehicleId, type } = req.query;
    const query = {};

    if (tripId) query.trip = tripId;
    if (vehicleId) query.vehicle = vehicleId;
    if (type) query.type = type;

    const expenses = await Expense.find(query)
      .populate('trip', 'status')
      .populate('vehicle', 'vehicleNumber model')
      .populate('addedBy', 'name email')
      .sort('-date');

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Manager, Admin
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await Expense.findByIdAndDelete(req.params.id);

    // Update trip total if applicable
    if (expense.trip) {
      const trip = await Trip.findById(expense.trip);
      if (trip) {
        const totalExpense = await Expense.aggregate([
          { $match: { trip: trip._id } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        trip.totalExpense = totalExpense.length > 0 ? totalExpense[0].total : 0;
        if (trip.totalDistance > 0) {
          trip.costPerKM = Math.round((trip.totalExpense / trip.totalDistance) * 100) / 100;
        }
        await trip.save();
      }
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
