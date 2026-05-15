const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createInquiry, getInquiries, getInquiry, updateInquiryStatus } = require('../controllers/tripInquiryController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.use(protect);

router.route('/')
  .get(authorize('admin', 'manager', 'staff'), getInquiries)
  .post(
    authorize('admin', 'manager', 'staff'),
    [
      body('vehicle').notEmpty().withMessage('Vehicle selection is required'),
      body('pickupLocation').notEmpty().withMessage('Pickup location is required'),
      body('dropLocation').notEmpty().withMessage('Drop location is required'),
      body('dateTime').notEmpty().withMessage('Date and time are required'),
    ],
    createInquiry
  );

router.get('/:id', authorize('admin', 'manager', 'staff'), getInquiry);

router.patch('/:id/status',
  authorize('admin', 'manager'),
  [
    body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  ],
  updateInquiryStatus
);

module.exports = router;
