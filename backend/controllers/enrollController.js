const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

const enrollInCourse = async (req, res) => {
  try {
    const { courseId, inquiryMessage } = req.body;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is already enrolled/pending
    const existingEnrollment = await Enrollment.findOne({ user: req.user.id, course: courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'You have already inquired about this course.' });
    }

    const enrollment = new Enrollment({
      user: req.user.id,
      course: courseId,
      inquiryMessage
    });

    const createdEnrollment = await enrollment.save();
    res.status(201).json(createdEnrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id }).populate('course', 'name image price durationMonths');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find().populate('course', 'name').populate('user', 'name email');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const activeStudents = (await Enrollment.distinct('user')).length;
    const totalEnrollments = await Enrollment.countDocuments();
    const featuredCourses = await Course.countDocuments({ featured: true });

    res.json({
      totalCourses,
      activeStudents,
      totalEnrollments,
      featuredCourses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEnrollmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'enrolled', 'completed'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    enrollment.status = status;
    const updatedEnrollment = await enrollment.save();
    res.json(updatedEnrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { enrollInCourse, getMyEnrollments, getAllEnrollments, getDashboardStats, updateEnrollmentStatus };
