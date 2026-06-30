const mongoose = require('mongoose');

const cvRegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  education: { type: String },
  experience: { type: String },
  skills: { type: String },
  message: { type: String },
  status: { type: String, enum: ['pending', 'contacted', 'completed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('CvRegistration', cvRegistrationSchema);
