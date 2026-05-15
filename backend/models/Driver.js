const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Driver name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true,
    trim: true,
  },
  licenseExpiry: {
    type: Date,
    required: [true, 'License expiry date is required'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  inactiveReason: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['available', 'on-trip', 'off-duty'],
    default: 'available',
  },
  profileImage: {
    type: String,
  },
  licenseDocumentUrl: {
    type: String,
  },
  aadharDocumentUrl: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
