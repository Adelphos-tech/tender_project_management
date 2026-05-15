const Vehicle = require('../models/Vehicle');
const { uploadToCloudinary } = require('../middleware/upload');
const { validationResult } = require('express-validator');

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Admin, Manager
exports.getVehicles = async (req, res) => {
  try {
    const { status, type, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { vehicleNumber: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
      ];
    }

    const vehicles = await Vehicle.find(query).sort('-createdAt');
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get available vehicles
// @route   GET /api/vehicles/available
// @access  Private (Staff, Manager, Admin)
exports.getAvailableVehicles = async (req, res) => {
  try {
    const { dateTime } = req.query; // Optional context, but base is current status
    const Trip = require('../models/Trip');
    const TripInquiry = require('../models/TripInquiry');

    // Find all vehicles currently marked 'active'
    let activeVehicles = await Vehicle.find({ status: 'active' });

    // Find vehicles assigned to ongoing trips
    const activeTrips = await Trip.find({ status: { $in: ['assigned', 'in-progress'] } });

    // Find vehicles booked for inquiries that are 'approved' BUT haven't been converted to active/completed trips yet
    const tripInquiryIds = await Trip.find().distinct('inquiry'); // all inquiry IDs that have a corresponding trip
    
    const upcomingInquiries = await TripInquiry.find({ 
      status: 'approved',
      _id: { $nin: tripInquiryIds } 
    });
    
    const bookedVehicleIds = upcomingInquiries
      .filter(iq => iq.vehicle)
      .map(iq => String(iq.vehicle));

    const activeVehicleIds = activeTrips
      .filter(t => t.vehicle)
      .map(t => String(t.vehicle));

    const unavailableSet = new Set([...activeVehicleIds, ...bookedVehicleIds]);

    // Filter out unavailable
    const available = activeVehicles.filter(v => v._id && !unavailableSet.has(String(v._id)));

    res.json(available);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Admin, Manager
exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create vehicle
// @route   POST /api/vehicles
// @access  Admin, Manager
exports.createVehicle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vehicleData = { ...req.body };

    // Handle Cloudinary File Uploads
    if (req.files) {
      if (req.files.rcBook && req.files.rcBook[0]) {
        const result = await uploadToCloudinary(req.files.rcBook[0].buffer, 'vehicle-documents');
        vehicleData.rcBookUrl = result.secure_url;
      }
      if (req.files.insurance && req.files.insurance[0]) {
        const result = await uploadToCloudinary(req.files.insurance[0].buffer, 'vehicle-documents');
        vehicleData.insuranceUrl = result.secure_url;
      }
      if (req.files.puc && req.files.puc[0]) {
        const result = await uploadToCloudinary(req.files.puc[0].buffer, 'vehicle-documents');
        vehicleData.pucUrl = result.secure_url;
      }
    }

    const vehicle = await Vehicle.create(vehicleData);
    res.status(201).json(vehicle);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Vehicle number already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Admin, Manager
exports.updateVehicle = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Handle Cloudinary File Uploads
    if (req.files) {
      if (req.files.rcBook && req.files.rcBook[0]) {
        const result = await uploadToCloudinary(req.files.rcBook[0].buffer, 'vehicle-documents');
        updateData.rcBookUrl = result.secure_url;
      }
      if (req.files.insurance && req.files.insurance[0]) {
        const result = await uploadToCloudinary(req.files.insurance[0].buffer, 'vehicle-documents');
        updateData.insuranceUrl = result.secure_url;
      }
      if (req.files.puc && req.files.puc[0]) {
        const result = await uploadToCloudinary(req.files.puc[0].buffer, 'vehicle-documents');
        updateData.pucUrl = result.secure_url;
      }
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Admin
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
