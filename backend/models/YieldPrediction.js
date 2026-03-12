const mongoose = require('mongoose');

const yieldSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cropName: { type: String, required: true },
  landSize: { type: Number, required: true },
  soilType: { type: String, required: true },
  season: { type: String, required: true },
  rainfall: { type: Number, required: true },
  fertilizer: { type: Number, required: true },
  irrigation: { type: String, required: true },
  prediction: {
    expectedYield: Number,
    unit: String,
    confidence: String,
    tips: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model('YieldPrediction', yieldSchema);