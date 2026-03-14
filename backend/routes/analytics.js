const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');const SoilReport = require('../models/soilReport');
const YieldPrediction = require('../models/YieldPrediction');
const DiseaseReport = require('../models/DiseaseReport');
const Advisory = require('../models/Advisory');
const Question = require('../models/Question');

router.get('/summary', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const [soilReports, yieldPredictions, diseaseReports, advisories, questions] =
      await Promise.all([
        SoilReport.find({ userId }).sort({ createdAt: -1 }),
        YieldPrediction.find({ userId }).sort({ createdAt: -1 }),
        DiseaseReport.find({ userId }).sort({ createdAt: -1 }),
        Advisory.find({ userId }).sort({ createdAt: -1 }),
        Question.find({ userId }).sort({ createdAt: -1 }),
      ]);

    // Soil health trend
    const soilTrend = soilReports.slice(0, 6).map(r => ({
      date: r.createdAt.toLocaleDateString('en-IN'),
      score: r.recommendation?.soilHealthScore || 0,
    })).reverse();

    // Yield history
    const yieldHistory = yieldPredictions.slice(0, 6).map(r => ({
      crop: r.cropName,
      yield: parseFloat(r.prediction?.expectedYield) || 0,
      date: r.createdAt.toLocaleDateString('en-IN'),
    })).reverse();

    // Disease frequency by type
    const diseaseFreq = {};
    diseaseReports.forEach(r => {
      const name = r.result?.diseaseName || 'Unknown';
      diseaseFreq[name] = (diseaseFreq[name] || 0) + 1;
    });

    // Monthly activity
    const monthlyActivity = {};
    [...soilReports, ...yieldPredictions, ...diseaseReports, ...advisories].forEach(r => {
      const month = new Date(r.createdAt).toLocaleString('en-IN', { month: 'short' });
      monthlyActivity[month] = (monthlyActivity[month] || 0) + 1;
    });

    res.json({
      success: true,
      summary: {
        totalSoilReports: soilReports.length,
        totalYieldPredictions: yieldPredictions.length,
        totalDiseaseReports: diseaseReports.length,
        totalAdvisories: advisories.length,
        totalQuestions: questions.length,
        avgSoilScore: soilReports.length
          ? Math.round(soilReports.reduce((a, r) => a + (r.recommendation?.soilHealthScore || 0), 0) / soilReports.length)
          : 0,
        latestYield: yieldPredictions[0]?.prediction?.expectedYield || 'N/A',
        latestCrop: yieldPredictions[0]?.cropName || 'N/A',
      },
      soilTrend,
      yieldHistory,
      diseaseFreq: Object.entries(diseaseFreq).map(([name, count]) => ({ name, count })),
      monthlyActivity: Object.entries(monthlyActivity).map(([month, count]) => ({ month, count })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;