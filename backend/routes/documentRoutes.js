const express = require('express');
const router = express.Router();
const {
  uploadDocument,
  getAllDocuments,
  getDocumentStats,
  getDocumentById,
  updateDocument,
  deleteDocument,
  downloadDocument,
} = require('../controllers/documentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { uploadDoc } = require('../middleware/uploadDoc');

// All document routes require authentication
router.use(protect);

// Stats route (needs to be before /:id)
router.get('/stats', getDocumentStats);

// Upload document middleware
router.post(
  '/upload',
  uploadDoc.single('file'),
  uploadDocument
);

// General routes
router.route('/')
  .get(getAllDocuments);

// ID specific routes
router.route('/:id')
  .get(getDocumentById)
  .put(updateDocument)
  .delete(deleteDocument);

router.post('/:id/download', downloadDocument);

module.exports = router;
