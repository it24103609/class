const PurchaseInquiry = require('../models/PurchaseInquiry');

const createPurchaseInquiry = async (req, res) => {
  try {
    const { productType, productId, productName, name, email, phone, message } = req.body;

    if (!productType || !productId || !productName || !name || !email || !phone) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const inquiry = new PurchaseInquiry({
      productType,
      productId,
      productName,
      name,
      email,
      phone,
      message,
    });

    const created = await inquiry.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPurchaseInquiries = async (req, res) => {
  try {
    const inquiries = await PurchaseInquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePurchaseInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'contacted', 'completed'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const inquiry = await PurchaseInquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    inquiry.status = status;
    const updated = await inquiry.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePurchaseInquiry = async (req, res) => {
  try {
    const inquiry = await PurchaseInquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    await inquiry.deleteOne();
    res.json({ message: 'Inquiry removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPurchaseInquiry,
  getAllPurchaseInquiries,
  updatePurchaseInquiryStatus,
  deletePurchaseInquiry,
};
