const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  cropName: { type: String },
  category: {
    type: String,
    enum: ['soil', 'crop', 'pest', 'weather', 'fertilizer', 'general'],
    default: 'general'
  },
  aiAnswer: { type: String },
  expertAnswer: { type: String },
  expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expertName: { type: String },
  isVerified: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['pending', 'ai-answered', 'expert-verified'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);