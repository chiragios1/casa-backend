const express = require('express');
const donationController = require('../controllers/donationController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// All donation routes require authentication
router.use(verifyToken);

// User donation routes
router.post('/', upload.single('image'), donationController.createDonation);
router.get('/user', donationController.getUserDonations);
router.get('/:donationId', donationController.getDonationById);

// Admin only routes (for updating donation status)
router.put('/:donationId/status', isAdmin, donationController.updateDonationStatus);

module.exports = router; 