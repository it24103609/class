const express = require('express');
const router = express.Router();
const { getBlogs, getBlogById, createBlog } = require('../controllers/blogController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getBlogs);
router.get('/:id', getBlogById);

// Admin routes
router.post('/', protect, admin, createBlog);

module.exports = router;
