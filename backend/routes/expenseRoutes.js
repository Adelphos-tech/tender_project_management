const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createExpense, getExpenses, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { upload } = require('../middleware/upload');

router.use(protect);

router.route('/')
  .get(authorize('admin', 'manager', 'driver'), getExpenses)
  .post(
    authorize('driver', 'admin', 'manager'),
    upload.single('billImage'),
    [
      body('tripId').optional().isMongoId().withMessage('Invalid Trip ID'),
      body('vehicleId').optional().isMongoId().withMessage('Invalid Vehicle ID'),
      body('type').isIn(['fuel', 'toll', 'parking', 'food', 'maintenance', 'other']).withMessage('Invalid expense type'),
      body('amount').isNumeric().withMessage('Amount must be a number'),
    ],
    createExpense
  );

router.delete('/:id', authorize('admin', 'manager'), deleteExpense);

module.exports = router;
