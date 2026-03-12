const express = require('express');
const router = express.Router();
const {
  askQuestion,
  getMyQuestions,
  getAllQuestions,
  expertAnswer
} = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/ask', protect, askQuestion);
router.get('/my-questions', protect, getMyQuestions);
router.get('/all', protect, getAllQuestions);
router.put('/expert-answer/:id', protect, expertAnswer);

module.exports = router;