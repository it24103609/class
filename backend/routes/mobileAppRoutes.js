const express = require('express');
const router = express.Router();
const {
  getMobileApps,
  getAdminMobileApps,
  getMobileAppById,
  createMobileApp,
  updateMobileApp,
  deleteMobileApp,
} = require('../controllers/mobileAppController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getMobileApps);
router.get('/admin/list', protect, admin, getAdminMobileApps);
router.get('/:id', getMobileAppById);
router.post('/', protect, admin, createMobileApp);
router.put('/:id', protect, admin, updateMobileApp);
router.delete('/:id', protect, admin, deleteMobileApp);

module.exports = router;
