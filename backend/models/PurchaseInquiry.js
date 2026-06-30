const mongoose = require('mongoose');

const purchaseInquirySchema = new mongoose.Schema({
  productType: { type: String, enum: ['website', 'mobileapp'], required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  productName: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ['pending', 'contacted', 'completed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('PurchaseInquiry', purchaseInquirySchema);
