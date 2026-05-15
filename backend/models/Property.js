const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  securityCode: {
    type: String,
    unique: true,
    trim: true,
  },
  itemCode: {
    type: String,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Asset name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Electronics', 'Computer', 'Furniture', 'Vehicle', 'Consumable', 'Other'],
  },
  make: {
    type: String,
    required: [true, 'Make is required'],
    trim: true,
  },
  model: {
    type: String,
    trim: true,
  },
  yearOfPurchase: {
    type: Number,
  },
  qty: {
    type: Number,
    default: 1,
    min: 1,
  },
  assignedQty: {
    type: Number,
    default: 0,
  },
  warrantyTill: {
    type: Date,
  },
  warrantyDocuments: [{
    url: String,
    description: String,
    expiryDate: Date,
  }],
  billUrl: {
    type: String,
  },
  assignedTo: {
    type: String,
    trim: true,
  },
  assignedToOffice: {
    type: String,
    trim: true,
  },
  responsiblePerson: {
    type: String,
    trim: true,
  },
  responsiblePersonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  location: {
    type: String,
    trim: true,
  },
  condition: {
    type: String,
    enum: ['new', 'good', 'fair', 'poor', 'damaged'],
    default: 'good',
  },
  purchasePrice: {
    type: Number,
    default: 0,
  },
  currentValue: {
    type: Number,
    default: 0,
  },
  depreciationRate: {
    type: Number,
    default: 10, // 10% per year
  },
  remarks: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'disposed', 'under_repair'],
    default: 'active',
  },
}, { timestamps: true });

// Auto-generate securityCode and itemCode before saving
propertySchema.pre('save', async function(next) {
  if (!this.itemCode) {
    const count = await mongoose.model('Property').countDocuments();
    const catCode = this.category ? this.category.substring(0, 3).toUpperCase() : 'AST';
    const nameCode = this.name ? this.name.substring(0, 3).toUpperCase() : 'UNK';
    const makeCode = this.make ? this.make.substring(0, 3).toUpperCase() : 'GEN';
    this.itemCode = `${catCode}/${nameCode}/${makeCode}/${String(count + 1).padStart(3, '0')}`;
  }

  if (!this.securityCode) {
    const catCode = this.category ? this.category.substring(0, 3).toUpperCase() : 'AST';
    const nameCode = this.name ? this.name.substring(0, 3).toUpperCase() : 'UNK';
    const makeCode = this.make ? this.make.substring(0, 3).toUpperCase() : 'GEN';
    const seq = Math.floor(Math.random() * 900) + 100; // Random 3-digit number
    this.securityCode = `${catCode}/${nameCode}/${makeCode}/${seq}`;
  }

  next();
});

module.exports = mongoose.model('Property', propertySchema);
