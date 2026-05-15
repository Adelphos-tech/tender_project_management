const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle, getAvailableVehicles } = require('../controllers/vehicleController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { upload } = require('../middleware/upload');

router.use(protect);

router.get('/available', authorize('admin', 'manager', 'staff'), getAvailableVehicles);

router.route('/')
  .get(authorize('admin', 'manager'), getVehicles)
  .post(
    authorize('admin', 'manager'),
    upload.fields([
      { name: 'rcBook', maxCount: 1 },
      { name: 'insurance', maxCount: 1 },
      { name: 'puc', maxCount: 1 }
    ]),
    [
      body('vehicleNumber').notEmpty().withMessage('Vehicle number is required'),
      body('model').notEmpty().withMessage('Model is required'),
      body('type').isIn(['sedan', 'suv', 'hatchback', 'van', 'bus', 'truck', 'other']).withMessage('Invalid type'),
    ],
    createVehicle
  );

router.route('/:id')
  .get(authorize('admin', 'manager'), getVehicle)
  .put(
    authorize('admin', 'manager'),
    upload.fields([
      { name: 'rcBook', maxCount: 1 },
      { name: 'insurance', maxCount: 1 },
      { name: 'puc', maxCount: 1 }
    ]),
    updateVehicle
  )
  .delete(authorize('admin'), deleteVehicle);

module.exports = router;
