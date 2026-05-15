const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  initializeRoles,
  getMyPermissions,
  getModules,
} = require('../controllers/roleController');

// All routes are protected
router.use(protect);

// Get my permissions - accessible to all authenticated users
router.get('/my-permissions', getMyPermissions);

// Initialize system roles
router.post('/init', authorize('admin'), initializeRoles);

// Get available modules
router.get('/modules', authorize('admin'), getModules);

// CRUD operations - admin only
router.route('/')
  .get(authorize('admin'), getRoles)
  .post(authorize('admin'), createRole);

router.route('/:id')
  .get(authorize('admin'), getRole)
  .put(authorize('admin'), updateRole)
  .delete(authorize('admin'), deleteRole);

module.exports = router;
