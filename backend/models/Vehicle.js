const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle number is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  model: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Vehicle type is required'],
    enum: ['sedan', 'suv', 'hatchback', 'van', 'bus', 'truck', 'other'],
  },
  year: {
    type: Number,
  },
  color: {
    type: String,
    trim: true,
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'electric', 'hybrid', 'cng'],
  },
  rcBookUrl: {
    type: String,
  },
  insuranceUrl: {
    type: String,
  },
  insuranceEndDate: {
    type: Date,
  },
  pucUrl: {
    type: String,
  },
  pucEndDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active',
  },
  currentKM: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
