const Advisory = require('../models/Advisory');

// AI Advisory Engine
const generateAdvisory = (cropName, season, soilType, region) => {
  const crop = cropName.toLowerCase();

  const sowingAdvice = [];
  const irrigationAdvice = [];
  const fertilizerAdvice = [];
  const pestAdvice = [];
  const harvestAdvice = [];
  const generalTips = [];

  // ── Sowing Advice ──────────────────────────────
  if (crop === 'wheat') {
    sowingAdvice.push('🌱 Sow wheat between October 15 to November 15 for best results');
    sowingAdvice.push('🌱 Use certified seeds — HD-2967 or PBW-343 are best for Punjab');
    sowingAdvice.push('🌱 Seed rate: 40-45 kg per acre');
  } else if (crop === 'rice') {
    sowingAdvice.push('🌱 Transplant rice seedlings in June-July for kharif season');
    sowingAdvice.push('🌱 Maintain 2-3 cm water level in field after transplanting');
    sowingAdvice.push('🌱 Use PR-126 or Pusa Basmati varieties for higher yield');
  } else if (crop === 'maize') {
    sowingAdvice.push('🌱 Sow maize in June for kharif season');
    sowingAdvice.push('🌱 Plant spacing: 60x20 cm for optimal growth');
    sowingAdvice.push('🌱 Seed rate: 8-10 kg per acre');
  } else if (crop === 'cotton') {
    sowingAdvice.push('🌱 Sow cotton in April-May after last frost');
    sowingAdvice.push('🌱 Use Bt cotton varieties for pest resistance');
    sowingAdvice.push('🌱 Row spacing: 60-90 cm');
  } else {
    sowingAdvice.push(`🌱 Sow ${cropName} as per regional calendar`);
    sowingAdvice.push('🌱 Use certified seeds from government approved suppliers');
  }

  // ── Irrigation Advice ──────────────────────────
  if (soilType === 'sandy') {
    irrigationAdvice.push('💧 Sandy soil needs frequent irrigation — every 4-5 days');
    irrigationAdvice.push('💧 Drip irrigation recommended to prevent water waste');
  } else if (soilType === 'clay') {
    irrigationAdvice.push('💧 Clay soil retains water — irrigate every 10-12 days');
    irrigationAdvice.push('💧 Avoid over-irrigation to prevent waterlogging');
  } else {
    irrigationAdvice.push('💧 Irrigate every 7-8 days for loamy/silty soil');
    irrigationAdvice.push('💧 Irrigate at critical growth stages — flowering and grain filling');
  }

  if (crop === 'rice') {
    irrigationAdvice.push('💧 Maintain standing water of 2-5 cm throughout growing season');
  }

  // ── Fertilizer Advice ──────────────────────────
  if (crop === 'wheat') {
    fertilizerAdvice.push('🧪 Apply 50 kg Urea + 50 kg DAP per acre at sowing');
    fertilizerAdvice.push('🧪 Top dress with 25 kg Urea at first irrigation (21 days)');
    fertilizerAdvice.push('🧪 Apply micronutrients — zinc sulfate 10 kg/acre if deficient');
  } else if (crop === 'rice') {
    fertilizerAdvice.push('🧪 Apply 30 kg DAP per acre as basal dose');
    fertilizerAdvice.push('🧪 Split urea application — at transplanting and tillering stage');
    fertilizerAdvice.push('🧪 Use green manure (Dhaincha) to reduce fertilizer need');
  } else {
    fertilizerAdvice.push('🧪 Apply NPK 12:32:16 at 50 kg per acre as basal dose');
    fertilizerAdvice.push('🧪 Top dress with nitrogen at vegetative stage');
    fertilizerAdvice.push('🧪 Apply potash if soil test shows deficiency');
  }

  // ── Pest & Disease Advice ──────────────────────
  if (crop === 'wheat') {
    pestAdvice.push('🐛 Watch for yellow rust — apply Propiconazole if spotted');
    pestAdvice.push('🐛 Aphid attack common in February — spray Imidacloprid');
    pestAdvice.push('🐛 Use integrated pest management (IPM) to reduce chemical use');
  } else if (crop === 'rice') {
    pestAdvice.push('🐛 Watch for stem borer — use Carbofuran granules');
    pestAdvice.push('🐛 Blast disease common in humid conditions — apply Tricyclazole');
    pestAdvice.push('🐛 Install light traps to monitor and control insects');
  } else if (crop === 'cotton') {
    pestAdvice.push('🐛 Pink bollworm is major pest — use pheromone traps');
    pestAdvice.push('🐛 Spray Neem-based pesticide as first line of defense');
    pestAdvice.push('🐛 Monitor whitefly weekly — can spread leaf curl virus');
  } else {
    pestAdvice.push('🐛 Scout field weekly for pest activity');
    pestAdvice.push('🐛 Use neem-based organic pesticides as first defense');
    pestAdvice.push('🐛 Contact local agricultural extension officer if unsure');
  }

  // ── Harvest Advice ─────────────────────────────
  if (crop === 'wheat') {
    harvestAdvice.push('🌾 Harvest when grain moisture is 20-25%');
    harvestAdvice.push('🌾 Use combine harvester for large fields — reduces losses');
    harvestAdvice.push('🌾 Expected harvest time: April in Punjab');
  } else if (crop === 'rice') {
    harvestAdvice.push('🌾 Harvest when 80% grains turn golden yellow');
    harvestAdvice.push('🌾 Avoid delayed harvest to prevent shattering losses');
    harvestAdvice.push('🌾 Dry grains to 14% moisture before storage');
  } else {
    harvestAdvice.push(`🌾 Harvest ${cropName} at physiological maturity`);
    harvestAdvice.push('🌾 Dry produce properly before storage');
    harvestAdvice.push('🌾 Store in clean, dry, pest-free storage facility');
  }

  // ── General Tips ───────────────────────────────
  generalTips.push('📋 Maintain a crop diary — record all activities and inputs');
  generalTips.push('📋 Get soil tested every 2-3 years from government lab');
  generalTips.push('📋 Register on PM Fasal Bima Yojana for crop insurance');
  generalTips.push('📋 Check mandi prices before selling — use e-NAM portal');

  if (region) {
    generalTips.push(`📋 Contact your local Krishi Vigyan Kendra in ${region} for expert guidance`);
  }

  return {
    sowingAdvice,
    irrigationAdvice,
    fertilizerAdvice,
    pestAdvice,
    harvestAdvice,
    generalTips
  };
};

// @route POST /api/advisory/generate
const generateFarmAdvisory = async (req, res) => {
  try {
    const { cropName, season, soilType, region, cropId } = req.body;

    if (!cropName) {
      return res.status(400).json({ message: '❌ cropName is required' });
    }

    const advisory = generateAdvisory(cropName, season, soilType, region);

    const result = await Advisory.create({
      userId: req.user._id,
      cropId, cropName, season,
      soilType, region, advisory
    });

    res.status(201).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/advisory/my-advisories
const getMyAdvisories = async (req, res) => {
  try {
    const advisories = await Advisory.find({ userId: req.user._id })
                                     .sort({ createdAt: -1 });
    res.json({ success: true, advisories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/advisory/:id
const getAdvisoryById = async (req, res) => {
  try {
    const advisory = await Advisory.findById(req.params.id);
    if (!advisory) {
      return res.status(404).json({ message: '❌ Advisory not found' });
    }
    res.json({ success: true, advisory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateFarmAdvisory,
  getMyAdvisories,
  getAdvisoryById
};