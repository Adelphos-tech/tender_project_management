const mongoose = require('mongoose');

const expenseDocumentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['fuel', 'service', 'maintenance', 'tax', 'toll', 'other'],
  },
  url: String,
  description: String,
  amount: Number,
}, { _id: false });

const tripSchema = new mongoose.Schema({
  inquiry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TripInquiry',
    required: true,
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
  },
  status: {
    type: String,
    enum: ['assigned', 'in-progress', 'completed'],
    default: 'assigned',
  },
  startKM: {
    type: Number,
  },
  endKM: {
    type: Number,
  },
  startOdometerImage: {
    type: String,
  },
  endOdometerImage: {
    type: String,
  },
  totalDistance: {
    type: Number,
    default: 0,
  },
  totalExpense: {
    type: Number,
    default: 0,
  },
  costPerKM: {
    type: Number,
    default: 0,
  },
  fuelAmount: {
    type: Number,
    default: 0,
  },
  fuelBillUrl: {
    type: String,
  },
  serviceParticular: {
    type: String,
    trim: true,
  },
  serviceAmount: {
    type: Number,
    default: 0,
  },
  serviceBillUrl: {
    type: String,
  },
  maintenanceParticular: {
    type: String,
    trim: true,
  },
  maintenanceAmount: {
    type: Number,
    default: 0,
  },
  maintenanceBillUrl: {
    type: String,
  },
  taxAmount: {
    type: Number,
    default: 0,
  },
  taxReceiptUrl: {
    type: String,
  },
  tollAmount: {
    type: Number,
    default: 0,
  },
  expenseDocuments: [expenseDocumentSchema],
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  rejectionReason: {
    type: String,
    trim: true,
  },
  tourFrom: {
    type: String,
    trim: true,
  },
  tourTo: {
    type: String,
    trim: true,
  },
  personTravelling: {
    type: String,
    trim: true,
  },
  purpose: {
    type: String,
    trim: true,
  },
  remarks: {
    type: String,
    trim: true,
  },
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
