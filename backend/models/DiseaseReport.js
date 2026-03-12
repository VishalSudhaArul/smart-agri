const mongoose = require('mongoose');

const diseaseReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imagePath: { type: String },
  cropName: { type: String, required: true },
  symptoms: { type: String, required: true },
  result: {
    diseaseName: String,
    severity: String,
    confidence: String,
    treatment: [String],
    prevention: [String],
    organicTreatment: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model('DiseaseReport', diseaseReportSchema);