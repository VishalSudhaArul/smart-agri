const express = require('express');
const router = express.Router();
const {
  generateFarmAdvisory,
  getMyAdvisories,
  getAdvisoryById
} = require('../controllers/advisoryController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateFarmAdvisory);
router.get('/my-advisories', protect, getMyAdvisories);
router.get('/:id', protect, getAdvisoryById);

module.exports = router;