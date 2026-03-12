const mongoose = require('mongoose');

const soilReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nitrogen: { type: Number, required: true },
  phosphorus: { type: Number, required: true },
  potassium: { type: Number, required: true },
  pH: { type: Number, required: true },
  moisture: { type: Number, required: true },
  organicMatter: { type: Number },
  recommendation: {
    soilHealthScore: Number,
    status: String,        // 'poor', 'moderate', 'good', 'excellent'
    suggestions: [String],
    bestCrops: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model('SoilReport', soilReportSchema);