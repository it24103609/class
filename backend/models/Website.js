const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  author: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  comment: { type: String, required: true },
}, { _id: true });

const websiteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  deployLink: { type: String, default: '' },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  techStack: { type: String, default: '' },
  reviews: [reviewSchema],
  published: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Website', websiteSchema);
