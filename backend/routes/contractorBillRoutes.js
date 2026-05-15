const express = require('express');
const {
  getStats,
  getAllBills,
  createBill,
  getById,
  updateBill,
  deleteBill,
  recordPayment
} = require('../controllers/contractorBillController');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

const router = express.Router();

router.use(protect); // All routes authenticated

router.route('/stats')
    .get(authorize('admin', 'manager'), getStats);

router.route('/')
    .get(authorize('admin', 'manager', 'staff'), getAllBills)
    .post(authorize('admin', 'manager'), createBill);

router.route('/:id')
    .get(authorize('admin', 'manager', 'staff'), getById)
    .put(authorize('admin', 'manager'), updateBill)
    .delete(authorize('admin'), deleteBill);

router.route('/:id/pay')
    .post(authorize('admin', 'manager'), recordPayment);

module.exports = router;
