const express = require('express');
const router = express.Router();
const { getCourses, getAdminCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route for courses (can include some query logic to hide unpublished unless admin)
router.get('/', getCourses);
router.get('/admin/list', protect, admin, getAdminCourses);

router.get('/:id', getCourseById);

// Admin routes
router.post('/', protect, admin, createCourse);
router.put('/:id', protect, admin, updateCourse);
router.delete('/:id', protect, admin, deleteCourse);

module.exports = router;
