const Driver = require('../models/Driver');
const User = require('../models/User');
const { uploadToCloudinary } = require('../middleware/upload');
const { validationResult } = require('express-validator');

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Admin, Manager
exports.getDrivers = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { licenseNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const drivers = await Driver.find(query).populate('user', 'name email').sort('-createdAt');
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get available drivers
// @route   GET /api/drivers/available
// @access  Admin, Manager
exports.getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ 
      status: 'available', 
      isActive: { $ne: false } 
    }).populate('user', 'name email');
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single driver
// @route   GET /api/drivers/:id
// @access  Admin, Manager
exports.getDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).populate('user', 'name email');
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current driver profile
// @route   GET /api/drivers/me
// @access  Driver
exports.getDriverMe = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user.id }).populate('user', 'name email phone');
    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create driver (also creates a user with 'driver' role)
// @route   POST /api/drivers
// @access  Admin, Manager
exports.createDriver = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, email, licenseNumber, licenseExpiry, address, password } = req.body;

    // Check if a user with this email exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    // Create user account for the driver
    user = await User.create({
      name,
      email,
      password: password || 'driver123',
      role: 'driver',
      phone,
    });

    // Handle Cloudinary File Uploads
    let licenseDocumentUrl = '';
    let aadharDocumentUrl = '';
    let profileImage = '';

    if (req.files) {
      if (req.files.licenseDocument && req.files.licenseDocument[0]) {
        const result = await uploadToCloudinary(req.files.licenseDocument[0].buffer, 'driver-documents');
        licenseDocumentUrl = result.secure_url;
      }
      if (req.files.aadharDocument && req.files.aadharDocument[0]) {
        const result = await uploadToCloudinary(req.files.aadharDocument[0].buffer, 'driver-documents');
        aadharDocumentUrl = result.secure_url;
      }
      if (req.files.profileImage && req.files.profileImage[0]) {
        const result = await uploadToCloudinary(req.files.profileImage[0].buffer, 'driver-profiles');
        profileImage = result.secure_url;
      }
    }

    const driver = await Driver.create({
      user: user._id,
      name,
      phone,
      email,
      licenseNumber,
      licenseExpiry,
      address,
      licenseDocumentUrl,
      aadharDocumentUrl,
      profileImage,
    });

    const populatedDriver = await Driver.findById(driver._id).populate('user', 'name email');
    res.status(201).json(populatedDriver);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'License number already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update driver
// @route   PUT /api/drivers/:id
// @access  Admin, Manager
exports.updateDriver = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Handle Cloudinary File Uploads
    if (req.files) {
      if (req.files.licenseDocument && req.files.licenseDocument[0]) {
        const result = await uploadToCloudinary(req.files.licenseDocument[0].buffer, 'driver-documents');
        updateData.licenseDocumentUrl = result.secure_url;
      }
      if (req.files.aadharDocument && req.files.aadharDocument[0]) {
        const result = await uploadToCloudinary(req.files.aadharDocument[0].buffer, 'driver-documents');
        updateData.aadharDocumentUrl = result.secure_url;
      }
      if (req.files.profileImage && req.files.profileImage[0]) {
        const result = await uploadToCloudinary(req.files.profileImage[0].buffer, 'driver-profiles');
        updateData.profileImage = result.secure_url;
      }
    }

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete driver
// @route   DELETE /api/drivers/:id
// @access  Admin
exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    if (driver.user) {
      await User.findByIdAndDelete(driver.user);
    }
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ message: 'Driver and user account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update driver status (Active/Inactive)
// @route   PATCH /api/drivers/status
// @access  Driver
exports.updateStatus = async (req, res) => {
  try {
    const { isActive, inactiveReason } = req.body;
    
    const driver = await Driver.findOne({ user: req.user.id });
    if (!driver) {
      return res.status(404).json({ message: 'Driver record not found' });
    }

    driver.isActive = isActive;
    if (!isActive) {
      driver.inactiveReason = inactiveReason || 'No reason provided';
    } else {
      driver.inactiveReason = '';
    }

    await driver.save();
    
    // Also update notification or log if needed
    
    res.json({ message: `Status updated to ${isActive ? 'Active' : 'Inactive'}`, driver });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
