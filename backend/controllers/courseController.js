const Course = require('../models/Course');

const getCourses = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;
    let query = { published: true };
    
    // Admin request
    if (req.user && req.user.role === 'admin') {
      query = {}; // Admin sees all courses
    }

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'priceLowHigh') sortOptions = { price: 1 };
    if (sort === 'featured') sortOptions = { featured: -1, createdAt: -1 };

    const courses = await Course.find(query).sort(sortOptions);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) res.json(course);
    else res.status(404).json({ message: 'Course not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const { name, price, originalPrice, durationMonths, youtubeLink, description, category, published, featured, imageUrl } = req.body;

    const course = new Course({
      name, price, originalPrice, durationMonths, image: imageUrl || '', youtubeLink, description, category, 
      published: published === 'true' || published === true, 
      featured: featured === 'true' || featured === true
    });
    
    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { name, price, originalPrice, durationMonths, youtubeLink, description, category, published, featured, imageUrl } = req.body;
    const course = await Course.findById(req.params.id);

    if (course) {
      course.name = name || course.name;
      course.price = price || course.price;
      if (originalPrice !== undefined) course.originalPrice = originalPrice;
      course.durationMonths = durationMonths || course.durationMonths;
      course.youtubeLink = youtubeLink || course.youtubeLink;
      course.description = description || course.description;
      course.category = category || course.category;
      if (published !== undefined) course.published = published === 'true' || published === true;
      if (featured !== undefined) course.featured = featured === 'true' || featured === true;

      if (imageUrl !== undefined && imageUrl !== '') {
        course.image = imageUrl;
      }

      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      await course.deleteOne();
      res.json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCourses, getAdminCourses, getCourseById, createCourse, updateCourse, deleteCourse };
