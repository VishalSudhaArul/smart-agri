const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { detectCropDisease, getMyDiseaseReports } = require('../controllers/diseaseController');
const { protect } = require('../middleware/authMiddleware');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ext) cb(null, true);
    else cb(new Error('Only images allowed!'));
  }
});

router.post('/detect', protect, upload.single('image'), detectCropDisease);
router.get('/my-reports', protect, getMyDiseaseReports);

module.exports = router;