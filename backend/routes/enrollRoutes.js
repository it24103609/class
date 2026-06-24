const express = require('express');
const router = express.Router();
const { enrollInCourse, getMyEnrollments, getAllEnrollments, getDashboardStats, updateEnrollmentStatus } = require('../controllers/enrollController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, enrollInCourse);
router.get('/myenrollments', protect, getMyEnrollments);

// Admin routes
router.get('/', protect, admin, getAllEnrollments);
router.get('/stats', protect, admin, getDashboardStats);
router.put('/:id/status', protect, admin, updateEnrollmentStatus);

module.exports = router;
