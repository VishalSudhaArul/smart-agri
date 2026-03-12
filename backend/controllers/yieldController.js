const YieldPrediction = require('../models/YieldPrediction');

// AI Yield Prediction Logic
const predictYield = (cropName, landSize, soilType, season, rainfall, fertilizer, irrigation) => {
  
  const baseYield = {
    wheat: 18, rice: 22, maize: 20, cotton: 12,
    sugarcane: 300, mustard: 10, soybean: 12,
    groundnut: 10, barley: 15, millet: 8
  };

  const crop = cropName.toLowerCase();
  let base = baseYield[crop] || 15;
  let multiplier = 1.0;
  let tips = [];

  // Soil type factor
  if (soilType === 'loamy') {
    multiplier += 0.2;
    tips.push('✅ Loamy soil is ideal — great for yield');
  } else if (soilType === 'sandy') {
    multiplier -= 0.15;
    tips.push('⚠️ Sandy soil drains fast — increase irrigation frequency');
  } else if (soilType === 'clay') {
    multiplier -= 0.1;
    tips.push('⚠️ Clay soil — ensure proper drainage to avoid waterlogging');
  }

  // Rainfall factor
  if (rainfall >= 600 && rainfall <= 1200) {
    multiplier += 0.15;
    tips.push('✅ Rainfall is optimal for good yield');
  } else if (rainfall < 400) {
    multiplier -= 0.2;
    tips.push('⚠️ Low rainfall — increase irrigation to compensate');
  } else if (rainfall > 1500) {
    multiplier -= 0.1;
    tips.push('⚠️ Excess rainfall — ensure proper field drainage');
  }

  // Fertilizer factor
  if (fertilizer >= 50 && fertilizer <= 100) {
    multiplier += 0.1;
    tips.push('✅ Fertilizer quantity is optimal');
  } else if (fertilizer < 30) {
    multiplier -= 0.15;
    tips.push('⚠️ Low fertilizer — increase NPK application');
  } else if (fertilizer > 150) {
    multiplier -= 0.05;
    tips.push('⚠️ Over-fertilization can harm crops — reduce quantity');
  }

  // Irrigation factor
  if (irrigation === 'drip') {
    multiplier += 0.15;
    tips.push('✅ Drip irrigation saves water and boosts yield');
  } else if (irrigation === 'sprinkler') {
    multiplier += 0.1;
  } else if (irrigation === 'rainfed') {
    multiplier -= 0.1;
    tips.push('⚠️ Rainfed crops are risky — consider supplemental irrigation');
  }

  // Season factor
  if (
    (crop === 'wheat' && season === 'rabi') ||
    (crop === 'rice' && season === 'kharif') ||
    (crop === 'maize' && season === 'kharif')
  ) {
    multiplier += 0.1;
    tips.push('✅ Crop season is perfectly matched');
  }

  const expectedYield = parseFloat((base * multiplier * landSize).toFixed(2));

  let confidence = 'Medium';
  if (multiplier >= 1.3) confidence = 'High';
  else if (multiplier < 0.9) confidence = 'Low';

  return { expectedYield, unit: 'quintals', confidence, tips };
};

// @route POST /api/yield/predict
const getYieldPrediction = async (req, res) => {
  console.log('Request body:', req.body);
  try {
    const {
      cropName, landSize, soilType,
      season, rainfall, fertilizer, irrigation
    } = req.body;

    if (!cropName || !landSize || !soilType || !season || !rainfall || !fertilizer || !irrigation) {
      return res.status(400).json({ message: '❌ All fields are required' });
    }

    const prediction = predictYield(
      cropName, landSize, soilType,
      season, rainfall, fertilizer, irrigation
    );

    const result = await YieldPrediction.create({
      userId: req.user._id,
      cropName, landSize, soilType,
      season, rainfall, fertilizer,
      irrigation, prediction
    });

    res.status(201).json({ success: true, result });
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/yield/my-predictions
const getMyPredictions = async (req, res) => {
  try {
    const predictions = await YieldPrediction.find({ userId: req.user._id })
                                             .sort({ createdAt: -1 });
    res.json({ success: true, predictions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getYieldPrediction, getMyPredictions };