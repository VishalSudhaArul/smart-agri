const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const askGemini = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Smart Crop Advisory
exports.generateAdvisory = async (req, res) => {
  try {
    const { cropName, season, soilType, region } = req.body;
    const prompt = `
      You are an expert Indian agricultural advisor. Give detailed farming advice in JSON format only.
      Crop: ${cropName}, Season: ${season}, Soil: ${soilType}, Region: ${region}, Country: India
      
      Return ONLY this JSON (no markdown, no extra text):
      {
        "advisory": {
          "sowingAdvice": ["tip1", "tip2", "tip3"],
          "irrigationAdvice": ["tip1", "tip2", "tip3"],
          "fertilizerAdvice": ["tip1", "tip2", "tip3"],
          "pestAdvice": ["tip1", "tip2", "tip3"],
          "harvestAdvice": ["tip1", "tip2", "tip3"],
          "generalTips": ["tip1", "tip2", "tip3"]
        }
      }
    `;
    const text = await askGemini(prompt);
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ message: 'Gemini AI failed: ' + error.message });
  }
};

// Smart Q&A
exports.answerQuestion = async (req, res) => {
  try {
    const { question, category } = req.body;
    const prompt = `
      You are an expert Indian agricultural advisor helping farmers.
      Answer this farming question in simple, practical Hindi/English mixed language:
      Question: ${question}
      Category: ${category}
      
      Give a helpful, specific, actionable answer in 3-4 sentences.
      Include specific product names, quantities, or timing where relevant.
    `;
    const answer = await askGemini(prompt);
    res.json({ success: true, answer });
  } catch (error) {
    res.status(500).json({ message: 'Gemini AI failed: ' + error.message });
  }
};

// Smart Disease Detection
exports.detectDisease = async (req, res) => {
  try {
    const { cropName, symptoms } = req.body;
    const prompt = `
      You are an expert plant pathologist for Indian crops.
      Crop: ${cropName}, Symptoms: ${symptoms}
      
      Return ONLY this JSON (no markdown):
      {
        "result": {
          "diseaseName": "disease name",
          "severity": "High/Moderate/Low",
          "confidence": "85%",
          "treatment": ["chemical treatment 1", "treatment 2", "treatment 3", "treatment 4"],
          "organicTreatment": ["organic 1", "organic 2", "organic 3"],
          "prevention": ["prevention 1", "prevention 2", "prevention 3", "prevention 4"]
        }
      }
    `;
    const text = await askGemini(prompt);
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ message: 'Gemini AI failed: ' + error.message });
  }
};