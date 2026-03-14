const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');const { generateAdvisory, answerQuestion, detectDisease } = require('../controllers/geminiController');

router.post('/advisory', protect, generateAdvisory);
router.post('/answer', protect, answerQuestion);
router.post('/disease', protect, detectDisease);

module.exports = router;