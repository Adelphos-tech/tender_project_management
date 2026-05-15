const express = require('express');
const {
  getFundFlowStats,
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateInstallment,
  payInstallment
} = require('../controllers/fundFlowController');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Stats
router.route('/stats')
    .get(authorize('admin', 'manager'), getFundFlowStats);

// Projects
router.route('/projects')
    .get(authorize('admin', 'manager', 'staff'), getAllProjects)
    .post(authorize('admin', 'manager'), createProject);

router.route('/projects/:id')
    .get(authorize('admin', 'manager', 'staff'), getProjectById)
    .put(authorize('admin', 'manager'), updateProject)
    .delete(authorize('admin'), deleteProject);

// Installments
router.route('/projects/:id/installments/:installmentId')
    .put(authorize('admin', 'manager'), updateInstallment);

router.route('/projects/:id/installments/:installmentId/pay')
    .post(authorize('admin', 'manager'), payInstallment);

module.exports = router;
