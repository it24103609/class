const express = require('express');
const router = express.Router();
const {
  createCvRegistration,
  getAllCvRegistrations,
  updateCvRegistrationStatus,
  deleteCvRegistration,
} = require('../controllers/cvController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', createCvRegistration);
router.get('/', protect, admin, getAllCvRegistrations);
router.put('/:id/status', protect, admin, updateCvRegistrationStatus);
router.delete('/:id', protect, admin, deleteCvRegistration);

module.exports = router;
