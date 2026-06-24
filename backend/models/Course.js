const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  durationMonths: { type: Number, required: true },
  image: { type: String },
  youtubeLink: { type: String },
  description: { type: String, required: true },
  category: { type: String, required: true },
  published: { type: Boolean, default: false },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
