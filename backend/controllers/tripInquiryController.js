const TripInquiry = require('../models/TripInquiry');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Create trip inquiry
// @route   POST /api/trip-inquiries
// @access  Staff, Manager, Admin
exports.createInquiry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const inquiry = await TripInquiry.create({
      ...req.body,
      createdBy: req.user._id,
    });

    const populated = await TripInquiry.findById(inquiry._id).populate('createdBy', 'name email role').populate('vehicle');

    // Notify admins and managers
    const notifyUsers = await User.find({ role: { $in: ['admin', 'manager'] } });
    const notifications = notifyUsers.map(u => ({
      user: u._id,
      title: 'New Trip Inquiry',
      message: `${req.user.name} has requested a vehicle for ${req.body.pickupLocation} to ${req.body.dropLocation}.`,
      type: 'new_inquiry',
      relatedId: inquiry._id,
    }));
    await Notification.insertMany(notifications);

    // Emit socket event to roles
    try {
      const io = require('../utils/socket').getIO();
      io.to('role_admin').to('role_manager').emit('new_inquiry', populated);
    } catch (socketErr) {
      console.error('Socket emit error:', socketErr.message);
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all trip inquiries
// @route   GET /api/trip-inquiries
// @access  Staff (own only), Manager, Admin (all)
exports.getInquiries = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};

    // Staff can only see their own inquiries
    if (req.user.role === 'staff') {
      query.createdBy = req.user._id;
    }

    if (status) query.status = status;

    const inquiries = await TripInquiry.find(query)
      .populate('createdBy', 'name email role')
      .populate('reviewedBy', 'name email')
      .sort('-createdAt');

    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single inquiry
// @route   GET /api/trip-inquiries/:id
// @access  Private
exports.getInquiry = async (req, res) => {
  try {
    const inquiry = await TripInquiry.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('reviewedBy', 'name email');

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    // Staff can only see own inquiries
    if (req.user.role === 'staff' && inquiry.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this inquiry' });
    }

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update inquiry status (approve/reject)
// @route   PATCH /api/trip-inquiries/:id/status
// @access  Manager, Admin
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status, rejectionReason, driverId } = req.body;
    const Driver = require('../models/Driver');
    const Trip = require('../models/Trip');

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    if (status === 'rejected' && !rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    if (status === 'approved' && !driverId) {
      return res.status(400).json({ message: 'Driver assignment is required for approval' });
    }

    const inquiry = await TripInquiry.findById(req.params.id).populate('vehicle');
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    if (inquiry.status !== 'pending') return res.status(400).json({ message: 'Inquiry has already been reviewed' });

    inquiry.status = status;
    inquiry.rejectionReason = rejectionReason;
    inquiry.reviewedBy = req.user._id;
    inquiry.reviewedAt = new Date();
    await inquiry.save();

    const populated = await TripInquiry.findById(inquiry._id)
      .populate('createdBy', 'name email role')
      .populate('reviewedBy', 'name email')
      .populate('vehicle');

    const io = require('../utils/socket').getIO();

    if (status === 'approved') {
      const driver = await Driver.findById(driverId).populate('user');
      if (!driver) return res.status(404).json({ message: 'Driver not found' });
      
      // Update Driver status
      driver.status = 'on-trip';
      await driver.save();

      // Create Trip
      const trip = await Trip.create({
        inquiry: inquiry._id,
        vehicle: inquiry.vehicle._id,
        driver: driver._id,
      });

      // Notify Requester
      await Notification.create({
        user: inquiry.createdBy,
        title: 'Trip Approved',
        message: `Your trip to ${inquiry.dropLocation} has been approved. Driver ${driver.name} assigned.`,
        type: 'inquiry_approved',
        relatedId: trip._id,
      });
      io.to(inquiry.createdBy.toString()).emit('inquiry_approved', populated);

      // Notify Driver
      const populatedTrip = await Trip.findById(trip._id)
        .populate('vehicle')
        .populate('driver')
        .populate({ path: 'inquiry', populate: { path: 'createdBy', select: 'name phone' } });

      await Notification.create({
        user: driver.user._id,
        title: 'New Trip Assigned',
        message: `You have been assigned a new trip to ${inquiry.dropLocation}. Passenger: ${populatedTrip.inquiry.createdBy.name}.`,
        type: 'new_trip_assigned',
        relatedId: trip._id,
      });
      io.to(driver.user._id.toString()).emit('new_trip_assigned', populatedTrip);
      
    } else {
      // Rejection Flow
      await Notification.create({
        user: inquiry.createdBy,
        title: 'Trip Rejected',
        message: `Your trip request to ${inquiry.dropLocation} was rejected. Reason: ${rejectionReason}`,
        type: 'inquiry_rejected',
        relatedId: inquiry._id,
      });
      io.to(inquiry.createdBy.toString()).emit('inquiry_rejected', populated);
    }

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
