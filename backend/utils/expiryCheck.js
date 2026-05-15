const cron = require('node-cron');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const Notification = require('../models/Notification');
const User = require('../models/User');

const checkExpiries = async () => {
  try {
    console.log('Running document expiry check...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);
    
    const endOfDaySeven = new Date(sevenDaysFromNow);
    endOfDaySeven.setHours(23, 59, 59, 999);

    // Find Admins and Managers to notify
    const admins = await User.find({ role: { $in: ['admin', 'manager'] } });
    if (admins.length === 0) return;

    const notifications = [];

    // 1. Check Driver Licenses (using licenseExpiry)
    const drivers = await Driver.find({
      licenseExpiry: { $gte: sevenDaysFromNow, $lte: endOfDaySeven }
    });

    for (const driver of drivers) {
      for (const admin of admins) {
        notifications.push({
          user: admin._id,
          title: 'Driver License Expiry Warning',
          message: `The license for driver ${driver.name} (License: ${driver.licenseNumber}) is set to expire on ${driver.licenseExpiry.toLocaleDateString()}.`,
          type: 'driver_expiry_warning',
          relatedId: driver._id
        });
      }
    }

    // 2. Check Vehicle Insurance
    const vehiclesInsurance = await Vehicle.find({
      insuranceEndDate: { $gte: sevenDaysFromNow, $lte: endOfDaySeven }
    });

    for (const vehicle of vehiclesInsurance) {
      for (const admin of admins) {
        notifications.push({
          user: admin._id,
          title: 'Vehicle Insurance Expiry Warning',
          message: `The insurance for vehicle ${vehicle.vehicleNumber} is set to expire on ${vehicle.insuranceEndDate.toLocaleDateString()}.`,
          type: 'vehicle_expiry_warning',
          relatedId: vehicle._id
        });
      }
    }

    // 3. Check Vehicle PUC
    const vehiclesPUC = await Vehicle.find({
      pucEndDate: { $gte: sevenDaysFromNow, $lte: endOfDaySeven }
    });

    for (const vehicle of vehiclesPUC) {
      for (const admin of admins) {
        notifications.push({
          user: admin._id,
          title: 'Vehicle PUC Expiry Warning',
          message: `The PUC for vehicle ${vehicle.vehicleNumber} is set to expire on ${vehicle.pucEndDate.toLocaleDateString()}.`,
          type: 'vehicle_expiry_warning',
          relatedId: vehicle._id
        });
      }
    }

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
      console.log(`Created ${notifications.length} expiry notifications.`);
      
      // Emit socket event if needed (optional, or just rely on re-fetching)
      try {
        const io = require('./socket').getIO();
        io.to('role_admin').to('role_manager').emit('new_notification');
      } catch (err) {
        // Socket might not be initialized
      }
    } else {
      console.log('No expiries found for today + 7 days.');
    }

  } catch (error) {
    console.error('Error in expiry check cron:', error);
  }
};

// Run every day at midnight (00:00)
const initCron = () => {
  cron.schedule('0 0 * * *', () => {
    checkExpiries();
  });
  console.log('Document expiry check cron job scheduled.');
  
  // Optional: Run once on startup for debugging/initial check
  // checkExpiries();
};

module.exports = { initCron, checkExpiries };
