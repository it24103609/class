const mongoose = require('mongoose');

const courseDaySchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  dayNumber: { type: Number, required: true },
  title: { type: String, required: true },
  notes: { type: String, default: '' },
  youtubeLink: { type: String, default: '' },
  imageUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('CourseDay', courseDaySchema);
