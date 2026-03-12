const express = require('express');
const router = express.Router();
const { getYieldPrediction, getMyPredictions } = require('../controllers/yieldController');
const { protect } = require('../middleware/authMiddleware');

router.post('/predict', protect, getYieldPrediction);
router.get('/my-predictions', protect, getMyPredictions);

module.exports = router;