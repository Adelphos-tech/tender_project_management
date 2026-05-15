const express = require('express');
const router = express.Router();
const { getReportSummary, getDetailedReport } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.use(protect);
router.use(authorize('admin', 'manager'));

router.get('/summary', getReportSummary);
router.get('/detailed', getDetailedReport);

module.exports = router;
