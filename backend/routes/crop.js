const express = require('express');
const router = express.Router();
const {
  addCrop, getMyCrops,
  getCropById, deleteCrop
} = require('../controllers/cropController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addCrop);
router.get('/my-crops', protect, getMyCrops);
router.get('/:id', protect, getCropById);
router.delete('/:id', protect, deleteCrop);

module.exports = router;