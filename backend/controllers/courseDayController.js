const CourseDay = require('../models/CourseDay');
const Enrollment = require('../models/Enrollment');

// GET all days for a course — admin OR enrolled student
const getDaysByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Admin can always access
    if (req.user.role !== 'admin') {
      // Check if user is enrolled and confirmed
      const enrollment = await Enrollment.findOne({
        user: req.user.id,
        course: courseId,
        status: 'enrolled'
      });
      if (!enrollment) {
        return res.status(403).json({ message: 'You are not enrolled in this course.' });
      }
    }

    const days = await CourseDay.find({ course: courseId }).sort({ dayNumber: 1 });
    res.json(days);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create a new day (admin only)
const createDay = async (req, res) => {
  try {
    const { course, dayNumber, title, notes, youtubeLink, imageUrl } = req.body;
    const day = new CourseDay({ course, dayNumber, title, notes, youtubeLink, imageUrl });
    const created = await day.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT update a day (admin only)
const updateDay = async (req, res) => {
  try {
    const { dayNumber, title, notes, youtubeLink, imageUrl } = req.body;
    const day = await CourseDay.findById(req.params.id);
    if (!day) return res.status(404).json({ message: 'Day not found' });

    day.dayNumber = dayNumber ?? day.dayNumber;
    day.title = title ?? day.title;
    day.notes = notes ?? day.notes;
    day.youtubeLink = youtubeLink ?? day.youtubeLink;
    day.imageUrl = imageUrl ?? day.imageUrl;

    const updated = await day.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a day (admin only)
const deleteDay = async (req, res) => {
  try {
    const day = await CourseDay.findById(req.params.id);
    if (!day) return res.status(404).json({ message: 'Day not found' });
    await day.deleteOne();
    res.json({ message: 'Day removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDaysByCourse, createDay, updateDay, deleteDay };
