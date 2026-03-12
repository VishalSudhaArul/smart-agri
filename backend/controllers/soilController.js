const SoilReport = require('../models/SoilReport');

// AI Logic — Soil Analyzer
const analyzeSoil = (nitrogen, phosphorus, potassium, pH, moisture) => {
  let score = 0;
  let suggestions = [];
  let bestCrops = [];

  // Nitrogen check (ideal: 280-560 kg/ha)
  if (nitrogen < 280) {
    suggestions.push('Nitrogen is low — apply Urea or DAP fertilizer');
  } else if (nitrogen > 560) {
    suggestions.push('Nitrogen is too high — reduce nitrogen-based fertilizers');
  } else {
    score += 20;
  }

  // Phosphorus check (ideal: 10-25 kg/ha)
  if (phosphorus < 10) {
    suggestions.push('Phosphorus is low — apply Single Super Phosphate (SSP)');
  } else if (phosphorus > 25) {
    suggestions.push('Phosphorus is high — avoid phosphate fertilizers');
  } else {
    score += 20;
  }

  // Potassium check (ideal: 110-280 kg/ha)
  if (potassium < 110) {
    suggestions.push('Potassium is low — apply Muriate of Potash (MOP)');
  } else if (potassium > 280) {
    suggestions.push('Potassium is high — limit potash fertilizers');
  } else {
    score += 20;
  }

  // pH check (ideal: 6.0-7.5)
  if (pH < 6.0) {
    suggestions.push('Soil is acidic — apply lime to increase pH');
  } else if (pH > 7.5) {
    suggestions.push('Soil is alkaline — apply gypsum or sulfur to reduce pH');
  } else {
    score += 20;
  }

  // Moisture check (ideal: 40-60%)
  if (moisture < 40) {
    suggestions.push('Moisture is low — increase irrigation frequency');
  } else if (moisture > 60) {
    suggestions.push('Moisture is high — improve drainage system');
  } else {
    score += 20;
  }

  // Best crops based on pH and nutrients
  if (pH >= 6.0 && pH <= 7.0 && nitrogen > 200) {
    bestCrops = ['Wheat', 'Rice', 'Maize', 'Sugarcane'];
  } else if (pH >= 5.5 && pH <= 6.5) {
    bestCrops = ['Tea', 'Coffee', 'Potato', 'Groundnut'];
  } else if (pH >= 7.0 && pH <= 8.0) {
    bestCrops = ['Cotton', 'Barley', 'Mustard', 'Sorghum'];
  } else {
    bestCrops = ['Soybean', 'Sunflower', 'Millet'];
  }

  // Status
  let status = 'poor';
  if (score >= 80) status = 'excellent';
  else if (score >= 60) status = 'good';
  else if (score >= 40) status = 'moderate';

  if (suggestions.length === 0) {
    suggestions.push('✅ Soil health is great! No major changes needed.');
  }

  return { soilHealthScore: score, status, suggestions, bestCrops };
};

// @route POST /api/soil/analyze
const analyzeSoilReport = async (req, res) => {
  try {
    const { nitrogen, phosphorus, potassium, pH, moisture, organicMatter } = req.body;

    // Run AI analysis
    const recommendation = analyzeSoil(
      nitrogen, phosphorus, potassium, pH, moisture
    );

    // Save to DB
    const report = await SoilReport.create({
      userId: req.user._id,
      nitrogen, phosphorus, potassium,
      pH, moisture, organicMatter,
      recommendation
    });

    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/soil/my-reports
const getMyReports = async (req, res) => {
  try {
    const reports = await SoilReport.find({ userId: req.user._id })
                                    .sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { analyzeSoilReport, getMyReports };