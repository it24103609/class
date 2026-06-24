const Blog = require('../models/Blog');

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 }).populate('author', 'name');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name');
    if (blog) res.json(blog);
    else res.status(404).json({ message: 'Blog not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, content, published, imageUrl } = req.body;

    const blog = new Blog({
      title,
      content,
      author: req.user.id,
      image: imageUrl || '',
      published: published === 'true' || published === true
    });
    
    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBlogs, getBlogById, createBlog };
