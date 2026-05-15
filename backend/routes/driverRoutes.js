const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { 
  getDrivers, 
  getDriver, 
  createDriver, 
  updateDriver, 
  deleteDriver, 
  getAvailableDrivers, 
  getDriverMe, 
  updateStatus 
} = require('../controllers/driverController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

const { upload } = require('../middleware/upload');

router.use(protect);

router.get('/available', authorize('admin', 'manager'), getAvailableDrivers);
router.get('/me', authorize('driver'), getDriverMe);
router.patch('/status', authorize('driver'), updateStatus);

router.route('/')
  .get(authorize('admin', 'manager'), getDrivers)
  .post(
    authorize('admin', 'manager'),
    upload.fields([
      { name: 'licenseDocument', maxCount: 1 },
      { name: 'aadharDocument', maxCount: 1 },
      { name: 'profileImage', maxCount: 1 }
    ]),
    [
      body('name').notEmpty().withMessage('Name is required'),
      body('phone').notEmpty().withMessage('Phone is required'),
      body('email').isEmail().withMessage('Valid email is required'),
      body('licenseNumber').notEmpty().withMessage('License number is required'),
      body('licenseExpiry').notEmpty().withMessage('License expiry is required'),
    ],
    createDriver
  );

router.route('/:id')
  .get(authorize('admin', 'manager'), getDriver)
  .put(
    authorize('admin', 'manager'),
    upload.fields([
      { name: 'licenseDocument', maxCount: 1 },
      { name: 'aadharDocument', maxCount: 1 },
      { name: 'profileImage', maxCount: 1 }
    ]),
    updateDriver
  )
  .delete(authorize('admin'), deleteDriver);

module.exports = router;
