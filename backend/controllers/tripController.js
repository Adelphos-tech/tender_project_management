const Trip = require('../models/Trip');
const TripInquiry = require('../models/TripInquiry');
const Driver = require('../models/Driver');
const Expense = require('../models/Expense');
const { uploadToCloudinary } = require('../middleware/upload');

// @desc    Create trip from approved inquiry
// @route   POST /api/trips
// @access  Manager, Admin
exports.createTrip = async (req, res) => {
  try {
    const { inquiryId, vehicleId, driverId, notes } = req.body;

    // Validate inquiry is approved
    const inquiry = await TripInquiry.findById(inquiryId);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    if (inquiry.status !== 'approved') {
      return res.status(400).json({ message: 'Only approved inquiries can be converted to trips' });
    }

    // Check if trip already exists for this inquiry
    const existingTrip = await Trip.findOne({ inquiry: inquiryId });
    if (existingTrip) {
      return res.status(400).json({ message: 'A trip already exists for this inquiry' });
    }

    // Update driver status
    await Driver.findByIdAndUpdate(driverId, { status: 'on-trip' });

    const trip = await Trip.create({
      inquiry: inquiryId,
      vehicle: vehicleId,
      driver: driverId,
      notes,
    });

    const populated = await Trip.findById(trip._id)
      .populate('inquiry')
      .populate('vehicle', 'vehicleNumber model type')
      .populate('driver', 'name phone');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all trips
// @route   GET /api/trips
// @access  Manager, Admin, Driver (own only)
exports.getTrips = async (req, res) => {
  try {
    const { status, driverId, vehicleId } = req.query;
    const query = {};

    if (status) query.status = status;
    if (vehicleId) query.vehicle = vehicleId;

    // Drivers can only see their own trips
    if (req.user.role === 'driver') {
      const driver = await Driver.findOne({ user: req.user._id });
      if (!driver) {
        return res.status(404).json({ message: 'Driver profile not found' });
      }
      query.driver = driver._id;
    } else if (driverId) {
      query.driver = driverId;
    }

    const trips = await Trip.find(query)
      .populate({
        path: 'inquiry',
        populate: { path: 'createdBy', select: 'name email' }
      })
      .populate('vehicle', 'vehicleNumber model type')
      .populate('driver', 'name phone')
      .sort('-createdAt');

    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single trip
// @route   GET /api/trips/:id
// @access  Private
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate({
        path: 'inquiry',
        populate: { path: 'createdBy', select: 'name email' }
      })
      .populate('vehicle', 'vehicleNumber model type')
      .populate('driver', 'name phone user');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Get expenses for this trip
    const expenses = await Expense.find({ trip: trip._id }).sort('-date');

    res.json({ ...trip.toObject(), expenses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Start trip
// @route   PATCH /api/trips/:id/start
// @access  Driver
exports.startTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.status !== 'assigned') {
      return res.status(400).json({ message: 'Trip can only be started from assigned status' });
    }

    const { startKM } = req.body;
    if (startKM === undefined || startKM === null) {
      return res.status(400).json({ message: 'Start KM is required' });
    }

    // Handle odometer image upload
    let startOdometerImage = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'trip-odometer');
      startOdometerImage = result.secure_url;
    } else {
      return res.status(400).json({ message: 'Start odometer image is required' });
    }

    trip.startKM = Number(startKM);
    trip.startOdometerImage = startOdometerImage;
    trip.status = 'in-progress';
    trip.startedAt = new Date();

    await trip.save();

    const populated = await Trip.findById(trip._id)
      .populate('inquiry')
      .populate('vehicle', 'vehicleNumber model type')
      .populate('driver', 'name phone');

    // Notify clients of the trip status change
    const io = require('../utils/socket').getIO();
    io.emit('trip_status_changed', populated);
    
    // Specifically notify managers/admins to refresh their trips view
    io.to('role_admin').to('role_manager').emit('new_trip_assigned', populated);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    End trip
// @route   PATCH /api/trips/:id/end
// @access  Driver
exports.endTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.status !== 'in-progress') {
      return res.status(400).json({ message: 'Trip must be in-progress to end' });
    }

    const { endKM } = req.body;
    if (endKM === undefined || endKM === null) {
      return res.status(400).json({ message: 'End KM is required' });
    }

    if (Number(endKM) <= trip.startKM) {
      return res.status(400).json({ message: 'End KM must be greater than Start KM' });
    }

    // Handle odometer image upload
    let endOdometerImage = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'trip-odometer');
      endOdometerImage = result.secure_url;
    } else {
      return res.status(400).json({ message: 'End odometer image is required' });
    }

    // Calculate totals
    const totalDistance = Number(endKM) - trip.startKM;

    // Get expenses for this trip
    const expenses = await Expense.find({ trip: trip._id });
    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const costPerKM = totalDistance > 0 ? totalExpense / totalDistance : 0;

    trip.endKM = Number(endKM);
    trip.endOdometerImage = endOdometerImage;
    trip.totalDistance = totalDistance;
    trip.totalExpense = totalExpense;
    trip.costPerKM = Math.round(costPerKM * 100) / 100;
    trip.status = 'completed';
    trip.completedAt = new Date();

    await trip.save();

    // Update driver status back to available
    await Driver.findByIdAndUpdate(trip.driver, { status: 'available' });

    const populated = await Trip.findById(trip._id)
      .populate('inquiry')
      .populate('vehicle', 'vehicleNumber model type')
      .populate('driver', 'name phone');

    // Notify clients of the trip status change
    const io = require('../utils/socket').getIO();
    io.emit('trip_status_changed', populated);
    
    // Specifically notify managers/admins to refresh their trips view
    io.to('role_admin').to('role_manager').emit('new_trip_assigned', populated);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
