const express = require('express');
const router = express.Router();
const {
  createPurchaseInquiry,
  getAllPurchaseInquiries,
  updatePurchaseInquiryStatus,
  deletePurchaseInquiry,
} = require('../controllers/purchaseController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', createPurchaseInquiry);
router.get('/', protect, admin, getAllPurchaseInquiries);
router.put('/:id/status', protect, admin, updatePurchaseInquiryStatus);
router.delete('/:id', protect, admin, deletePurchaseInquiry);

module.exports = router;
