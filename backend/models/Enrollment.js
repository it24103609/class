const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  status: { type: String, enum: ['pending', 'enrolled', 'completed'], default: 'pending' },
  enrollmentCode: { type: String },
  inquiryMessage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
