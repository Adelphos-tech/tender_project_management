const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['new_inquiry', 'inquiry_approved', 'inquiry_rejected', 'new_trip_assigned', 'trip_status_changed', 'system', 'expiry_warning', 'driver_expiry_warning', 'vehicle_expiry_warning'],
    default: 'system',
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId, // Can be TripInquiry ID or Trip ID
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  expireAt: {
    type: Date,
    // Set default to exactly 2 days (48 hours) from creation
    default: () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 
    expires: 0 // Deletes this document when the current time reaches this expireAt date
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
