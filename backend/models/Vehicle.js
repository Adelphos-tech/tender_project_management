const mongoose = require('mongoose');

const warrantySchema = new mongoose.Schema({
  brand: String,
  purchaseDate: Date,
  warrantyMonths: Number,
  expiryDate: Date,
  billUrl: String,
}, { _id: false });

const vehicleSchema = new mongoose.Schema({
  itemCode: {
    type: String,
    unique: true,
    trim: true,
  },
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
    enum: ['sedan', 'suv', 'hatchback', 'van', 'bus', 'truck', 'bike', 'scooter', 'other'],
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
  purchasePrice: {
    type: Number,
    default: 0,
  },
  purchaseDate: {
    type: Date,
  },
  tyreWarranty: warrantySchema,
  batteryWarranty: warrantySchema,
}, { timestamps: true });

// Auto-generate itemCode before saving
vehicleSchema.pre('save', async function(next) {
  if (!this.itemCode) {
    const count = await mongoose.model('Vehicle').countDocuments();
    const typeCode = this.type ? this.type.substring(0, 3).toUpperCase() : 'VEH';
    const makeCode = this.model ? this.model.substring(0, 3).toUpperCase() : 'UNK';
    this.itemCode = `VEH/${typeCode}/${makeCode}/${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
