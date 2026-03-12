const Question = require('../models/Question');

// AI Answer Generator
const generateAIAnswer = (title, description, category, cropName) => {
  const q = (title + ' ' + description).toLowerCase();

  // Yellow spots / rust
  if (q.includes('yellow') && (q.includes('spot') || q.includes('leaf') || q.includes('leave'))) {
    return `🤖 AI Answer: Yellow spots on crops usually indicate one of these:

1. 🍄 Yellow Rust (Fungal Disease):
   • Apply Propiconazole 25EC @ 1ml/litre water
   • Spray in early morning or evening
   • Repeat after 15 days if needed

2. 🪲 Aphid Attack:
   • Spray Imidacloprid 17.8SL @ 0.5ml/litre
   • Remove heavily infected leaves

3. 🧪 Nutrient Deficiency (Nitrogen/Zinc):
   • Apply Zinc Sulphate @ 25kg/ha
   • Top dress with Urea @ 25kg/acre

Prevention: Avoid excess irrigation and ensure proper field drainage.
⚠️ This is an AI-generated answer. Please wait for expert verification.`;
  }

  // Insects / pests roaming
  if (q.includes('insect') || q.includes('roaming') || q.includes('bug') || q.includes('worm')) {
    return `🤖 AI Answer: For insects/pests roaming around crops:

1. 🔍 Identification First:
   • Check if insects are on leaves, stems or soil
   • Take a photo and match with pest identification guides

2. 🌿 Organic Control (First line):
   • Neem oil spray @ 5ml/litre water
   • Install yellow sticky traps
   • Use pheromone traps for moths

3. 💊 Chemical Control (If severe):
   • Chlorpyrifos 20EC @ 2ml/litre for soil insects
   • Lambda-cyhalothrin for caterpillars
   • Thiamethoxam for sucking pests

4. 🛡️ Prevention:
   • Crop rotation every season
   • Keep field weed-free
   • Install light traps at night
⚠️ This is an AI-generated answer. Please wait for expert verification.`;
  }

  // Wilting / dying
  if (q.includes('wilt') || q.includes('dying') || q.includes('dry') || q.includes('dead')) {
    return `🤖 AI Answer: Wilting/dying crops can be caused by:

1. 💧 Water Stress:
   • Check soil moisture immediately
   • Irrigate if soil is dry 2 inches below surface
   • Avoid waterlogging — ensure proper drainage

2. 🍄 Root Rot (Fungal):
   • Apply Carbendazim @ 1g/litre as soil drench
   • Improve drainage in waterlogged areas

3. 🌡️ Heat Stress:
   • Irrigate in early morning or evening
   • Apply mulching to retain soil moisture

4. 🧪 Fertilizer Burn:
   • If excess fertilizer applied, irrigate heavily
   • Avoid fertilizer touching plant stem
⚠️ This is an AI-generated answer. Please wait for expert verification.`;
  }

  // Low yield
  if (q.includes('yield') || q.includes('production') || q.includes('harvest') || q.includes('less crop')) {
    return `🤖 AI Answer: To improve crop yield:

1. 🧪 Soil Health:
   • Get soil tested — apply nutrients based on results
   • Apply FYM @ 4-5 tonnes/acre before sowing

2. 🌱 Seed Quality:
   • Use certified high-yielding varieties
   • Treat seeds with fungicide before sowing

3. 💧 Irrigation Management:
   • Irrigate at critical stages — flowering & grain filling
   • Adopt drip irrigation for 40% water saving

4. 🐛 Pest & Disease Control:
   • Regular scouting every 7-10 days
   • Early detection = less crop loss

5. 📋 Good Practices:
   • Proper plant spacing for sunlight penetration
   • Timely harvesting to avoid field losses
⚠️ This is an AI-generated answer. Please wait for expert verification.`;
  }

  // Soil / fertilizer
  if (category === 'soil' || q.includes('soil') || q.includes('fertilizer') || q.includes('nutrient')) {
    return `🤖 AI Answer: For soil/fertilizer related queries:

1. 🧪 Soil Testing:
   • Get soil tested from nearest KVK (free service)
   • Test for NPK, pH, organic carbon, zinc

2. 📊 General Fertilizer Recommendation:
   • Wheat: 120:60:40 kg NPK/ha
   • Rice: 100:50:50 kg NPK/ha
   • Maize: 120:60:40 kg NPK/ha

3. 🌿 Organic Options:
   • FYM @ 4-5 tonnes/acre
   • Vermicompost @ 2 tonnes/acre
   • Bio-fertilizers (Rhizobium, PSB)

4. ⚠️ Common Deficiencies in Punjab:
   • Zinc — apply ZnSO4 @ 25 kg/ha
   • Iron — apply FeSO4 foliar spray
⚠️ This is an AI-generated answer. Please wait for expert verification.`;
  }

  // Weather
  if (category === 'weather' || q.includes('rain') || q.includes('flood') || q.includes('drought') || q.includes('heat')) {
    return `🤖 AI Answer: Weather-related farming advice:

1. 🌧️ Excess Rainfall/Flood:
   • Drain excess water immediately
   • Avoid fertilizer application for 3-4 days
   • Watch for fungal diseases after flood

2. 🏜️ Drought/Heat Stress:
   • Irrigate in early morning or late evening
   • Apply mulching to conserve moisture
   • Use drought-tolerant varieties next season

3. ❄️ Cold/Frost:
   • Light irrigation before frost protects crops
   • Use plastic covers for nursery beds
   • Avoid sowing sensitive crops in frost season

4. ☀️ Clear Weather:
   • Good time for pesticide spraying
   • Ideal for harvesting and threshing
⚠️ This is an AI-generated answer. Please wait for expert verification.`;
  }

  // Crop specific
  if (cropName) {
    return `🤖 AI Answer: For ${cropName} cultivation:

1. 🌱 Crop Management:
   • Use recommended varieties for your region
   • Follow proper sowing time and spacing
   • Ensure good seed-soil contact

2. 💧 Water Management:
   • Irrigate at critical growth stages
   • Avoid both water stress and waterlogging

3. 🧪 Nutrition:
   • Apply balanced NPK as per soil test
   • Use micronutrients if deficiency observed

4. 🐛 Protection:
   • Scout regularly for pests and diseases
   • Use IPM approach — organic first, then chemical

5. 📞 Expert Help:
   • Contact KVK: 1800-180-1551 (Toll Free)
   • Visit nearest agricultural office
⚠️ This is an AI-generated answer. Please wait for expert verification.`;
  }

  // General fallback
  return `🤖 AI Answer: Thank you for your question!

1. 📋 General Farming Tips:
   • Get soil tested every 2-3 years
   • Use certified seeds from approved suppliers
   • Follow Integrated Pest Management (IPM)
   • Maintain crop diary for better decisions

2. 🆘 Helplines:
   • Kisan Call Centre: 1800-180-1551 (Toll Free)
   • PM Kisan Helpline: 155261
   • Soil Health Card: soilhealth.dac.gov.in

3. 🌾 Our Tools:
   • Use Soil Analyzer for soil health
   • Use Crop Advisor for farming advice
   • Use Yield Predictor for harvest estimate
⚠️ This is an AI-generated answer. Please wait for expert verification.`;
};

// @route POST /api/questions/ask
const askQuestion = async (req, res) => {
  try {
    const { title, description, cropName, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: '❌ Title and description are required' });
    }

    const aiAnswer = generateAIAnswer(title, description, category, cropName);

    const question = await Question.create({
      userId: req.user._id,
      userName: req.user.name,
      title, description, cropName,
      category, aiAnswer,
      status: 'ai-answered'
    });

    res.status(201).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/questions/my-questions
const getMyQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ userId: req.user._id })
                                    .sort({ createdAt: -1 });
    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/questions/all
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
                                    .sort({ createdAt: -1 });
    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/questions/expert-answer/:id
const expertAnswer = async (req, res) => {
  try {
    const { expertAnswer } = req.body;

    if (req.user.role !== 'expert' && req.user.role !== 'admin') {
      return res.status(403).json({ message: '❌ Only experts can answer' });
    }

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      {
        expertAnswer,
        expertId: req.user._id,
        expertName: req.user.name,
        isVerified: true,
        status: 'expert-verified'
      },
      { new: true }
    );

    res.json({ success: true, question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { askQuestion, getMyQuestions, getAllQuestions, expertAnswer };