const express = require('express');
const router = express.Router();
const {
  getWebsites,
  getAdminWebsites,
  getWebsiteById,
  createWebsite,
  updateWebsite,
  deleteWebsite,
} = require('../controllers/websiteController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getWebsites);
router.get('/admin/list', protect, admin, getAdminWebsites);
router.get('/:id', getWebsiteById);
router.post('/', protect, admin, createWebsite);
router.put('/:id', protect, admin, updateWebsite);
router.delete('/:id', protect, admin, deleteWebsite);

module.exports = router;
