const express = require('express');
const router = express.Router();
const { analyzeSoilReport, getMyReports } = require('../controllers/soilController');
const { protect } = require('../middleware/authMiddleware');

router.post('/analyze', protect, analyzeSoilReport);
router.get('/my-reports', protect, getMyReports);

module.exports = router;