const express = require('express');
const router = express.Router();
const { getDaysByCourse, createDay, updateDay, deleteDay } = require('../controllers/courseDayController');
const { protect, admin } = require('../middleware/authMiddleware');

// Enrolled student or admin can fetch days for a course
router.get('/:courseId', protect, getDaysByCourse);

// Admin only — create, update, delete
router.post('/', protect, admin, createDay);
router.put('/:id', protect, admin, updateDay);
router.delete('/:id', protect, admin, deleteDay);

module.exports = router;
