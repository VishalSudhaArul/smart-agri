const DiseaseReport = require('../models/DiseaseReport');

// AI Disease Detection Engine
const detectDisease = (cropName, symptoms) => {
  const crop = cropName.toLowerCase();
  const s = symptoms.toLowerCase();

  // Yellow rust
  if (s.includes('yellow') && (s.includes('stripe') || s.includes('rust') || s.includes('spot'))) {
    return {
      diseaseName: 'Yellow Rust (Puccinia striiformis)',
      severity: s.includes('severe') || s.includes('spread') ? 'High' : 'Moderate',
      confidence: '87%',
      treatment: [
        'Apply Propiconazole 25EC @ 1ml/litre water immediately',
        'Spray Tebuconazole 25.9EC @ 1ml/litre as alternative',
        'Repeat spray after 15 days if infection persists',
        'Spray during early morning or late evening'
      ],
      organicTreatment: [
        'Spray Neem oil @ 5ml/litre water',
        'Apply wood ash on affected leaves',
        'Use baking soda solution @ 5g/litre water'
      ],
      prevention: [
        'Use rust-resistant varieties like PBW-550, HD-2781',
        'Avoid excess nitrogen fertilization',
        'Ensure proper spacing for air circulation',
        'Early sowing helps avoid peak rust season'
      ]
    };
  }

  // Blast disease
  if (s.includes('blast') || (s.includes('brown') && s.includes('lesion'))) {
    return {
      diseaseName: 'Blast Disease (Magnaporthe oryzae)',
      severity: 'High',
      confidence: '85%',
      treatment: [
        'Apply Tricyclazole 75WP @ 0.6g/litre water',
        'Spray Isoprothiolane 40EC @ 1.5ml/litre',
        'Apply at booting stage for neck blast prevention',
        'Repeat after 10-12 days'
      ],
      organicTreatment: [
        'Spray Pseudomonas fluorescens @ 10g/litre',
        'Apply Trichoderma viride as soil treatment',
        'Use silicon-based soil amendments'
      ],
      prevention: [
        'Use blast-resistant varieties',
        'Avoid excess nitrogen application',
        'Maintain proper water management',
        'Remove infected crop debris after harvest'
      ]
    };
  }

  // Powdery mildew
  if (s.includes('white') && (s.includes('powder') || s.includes('coating') || s.includes('mildew'))) {
    return {
      diseaseName: 'Powdery Mildew (Erysiphe cichoracearum)',
      severity: 'Moderate',
      confidence: '82%',
      treatment: [
        'Apply Carbendazim 50WP @ 1g/litre water',
        'Spray Hexaconazole 5SC @ 1ml/litre',
        'Apply Sulfur 80WP @ 3g/litre as contact fungicide',
        'Repeat every 10-15 days'
      ],
      organicTreatment: [
        'Spray milk solution (1:9 ratio with water)',
        'Apply baking soda @ 5g/litre water',
        'Neem oil spray @ 5ml/litre'
      ],
      prevention: [
        'Improve air circulation with proper spacing',
        'Avoid overhead irrigation',
        'Remove and destroy infected plant parts',
        'Use resistant varieties where available'
      ]
    };
  }

  // Blight
  if (s.includes('blight') || (s.includes('brown') && s.includes('edge')) || s.includes('water soaked')) {
    return {
      diseaseName: 'Leaf Blight (Helminthosporium spp.)',
      severity: s.includes('entire') || s.includes('all') ? 'High' : 'Moderate',
      confidence: '80%',
      treatment: [
        'Apply Mancozeb 75WP @ 2.5g/litre water',
        'Spray Zineb 75WP @ 2g/litre water',
        'Use Copper Oxychloride @ 3g/litre',
        'Repeat spray every 10 days'
      ],
      organicTreatment: [
        'Spray Bordeaux mixture (1%) on affected plants',
        'Apply Trichoderma-based biocontrol agents',
        'Use garlic extract spray @ 50g/litre'
      ],
      prevention: [
        'Use disease-free certified seeds',
        'Treat seeds with Thiram @ 3g/kg before sowing',
        'Avoid waterlogging in field',
        'Crop rotation with non-host crops'
      ]
    };
  }

  // Aphids / sucking pests
  if (s.includes('aphid') || s.includes('sticky') || s.includes('curling') || s.includes('suck')) {
    return {
      diseaseName: 'Aphid Infestation (Aphis gossypii)',
      severity: 'Moderate',
      confidence: '88%',
      treatment: [
        'Spray Imidacloprid 17.8SL @ 0.5ml/litre water',
        'Apply Thiamethoxam 25WG @ 0.3g/litre',
        'Use Dimethoate 30EC @ 1.5ml/litre for severe cases',
        'Repeat after 7-10 days if needed'
      ],
      organicTreatment: [
        'Neem oil spray @ 5ml/litre water',
        'Spray soap water solution @ 5ml/litre',
        'Release ladybird beetles as biological control',
        'Yellow sticky traps to monitor population'
      ],
      prevention: [
        'Avoid excess nitrogen fertilization',
        'Install reflective mulches to repel aphids',
        'Encourage natural predators in field',
        'Regular monitoring every 5-7 days'
      ]
    };
  }

  // Stem borer
  if (s.includes('borer') || s.includes('dead heart') || s.includes('white ear') || s.includes('stem')) {
    return {
      diseaseName: 'Stem Borer (Scirpophaga incertulas)',
      severity: 'High',
      confidence: '84%',
      treatment: [
        'Apply Carbofuran 3G @ 25kg/ha in standing water',
        'Spray Chlorpyrifos 20EC @ 2.5ml/litre water',
        'Use Fipronil 5SC @ 1.5ml/litre for severe attack',
        'Apply at early infestation stage for best results'
      ],
      organicTreatment: [
        'Release Trichogramma japonicum @ 1 lakh/ha',
        'Install light traps @ 1/acre to catch adult moths',
        'Apply Bacillus thuringiensis (Bt) spray',
        'Remove and destroy affected tillers immediately'
      ],
      prevention: [
        'Use stem borer resistant varieties',
        'Synchronize planting in an area',
        'Avoid ratoon cropping',
        'Deep ploughing after harvest to destroy pupae'
      ]
    };
  }

  // General/unknown
  return {
    diseaseName: `Unidentified Disease/Pest on ${cropName}`,
    severity: 'Unknown',
    confidence: '60%',
    treatment: [
      'Consult nearest Krishi Vigyan Kendra immediately',
      'Take sample to agricultural lab for diagnosis',
      'Apply broad-spectrum fungicide as precaution',
      'Call Kisan Call Centre: 1800-180-1551'
    ],
    organicTreatment: [
      'Neem oil spray @ 5ml/litre as general preventive',
      'Remove and destroy visibly infected plant parts',
      'Improve air circulation around plants'
    ],
    prevention: [
      'Use certified disease-free seeds',
      'Practice crop rotation every season',
      'Maintain field hygiene',
      'Regular monitoring every 7 days'
    ]
  };
};

// @route POST /api/disease/detect
const detectCropDisease = async (req, res) => {
  try {
    const { cropName, symptoms } = req.body;

    if (!cropName || !symptoms) {
      return res.status(400).json({ message: '❌ Crop name and symptoms are required' });
    }

    const result = detectDisease(cropName, symptoms);
    const imagePath = req.file ? req.file.filename : null;

    const report = await DiseaseReport.create({
      userId: req.user._id,
      cropName, symptoms,
      imagePath, result
    });

    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/disease/my-reports
const getMyDiseaseReports = async (req, res) => {
  try {
    const reports = await DiseaseReport.find({ userId: req.user._id })
                                       .sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { detectCropDisease, getMyDiseaseReports };