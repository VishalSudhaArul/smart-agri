const mongoose = require('mongoose');

const advisorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cropId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop'
  },
  cropName: { type: String, required: true },
  season: { type: String },
  soilType: { type: String },
  region: { type: String },
  advisory: {
    sowingAdvice: [String],
    irrigationAdvice: [String],
    fertilizerAdvice: [String],
    pestAdvice: [String],
    harvestAdvice: [String],
    generalTips: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model('Advisory', advisorySchema);