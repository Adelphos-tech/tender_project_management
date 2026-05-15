const express = require('express');
const router = express.Router();
const { createTrip, getTrips, getTrip, startTrip, endTrip } = require('../controllers/tripController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { upload } = require('../middleware/upload');

router.use(protect);

router.route('/')
  .get(authorize('admin', 'manager', 'driver'), getTrips)
  .post(authorize('admin', 'manager'), createTrip);

router.get('/:id', authorize('admin', 'manager', 'driver'), getTrip);

router.patch('/:id/start',
  authorize('driver', 'admin', 'manager'),
  upload.single('startOdometerImage'),
  startTrip
);

router.patch('/:id/end',
  authorize('driver', 'admin', 'manager'),
  upload.single('endOdometerImage'),
  endTrip
);

module.exports = router;
