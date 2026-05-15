const mongoose = require('mongoose');

const contractorBillSchema = new mongoose.Schema({
  // Required core info
  projectName: {
    type: String,
    required: true,
    trim: true,
  },
  contractorName: {
    type: String,
    required: true,
    trim: true,
  },
  contractorContact: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  totalContractValue: {
    type: Number,
    required: true,
    min: [0, 'Amount must be positive'],
  },

  // --- On-Paper Track ---
  paperBillNo: {
    type: String,
    trim: true,
  },
  paperBillDate: {
    type: Date,
    required: true,
  },
  paperBillAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentRequested: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid'],
    default: 'pending',
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  paymentDate: {
    type: Date,
  },

  // --- On-Site Track ---
  onSiteCompletionPct: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  onSiteMeasuredBy: {
    type: String,
    trim: true,
  },
  onSiteMeasurementDate: {
    type: Date,
  },
  varianceNote: {
    type: String,
    trim: true,
  },

  // State management
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'paid', 'disputed'],
    default: 'submitted',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// Virtual to auto calculate payment request pct of the paper bill amount
contractorBillSchema.virtual('paymentRequestPct').get(function() {
  if (!this.paperBillAmount) return 0;
  return (this.paymentRequested / this.paperBillAmount) * 100;
});

// Virtual to auto calculate paper bill relative to total contract value
contractorBillSchema.virtual('paperBillPct').get(function() {
  if (!this.totalContractValue) return 0;
  return (this.paperBillAmount / this.totalContractValue) * 100;
});

// Configure JSON formatting to include virtuals
contractorBillSchema.set('toJSON', { virtuals: true });
contractorBillSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('ContractorBill', contractorBillSchema);
