const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const cropPrices = {
  wheat: { name: 'Wheat', price: 2275, unit: 'quintal', trend: 'up', change: '+45', state: 'Punjab' },
  rice: { name: 'Rice', price: 2183, unit: 'quintal', trend: 'stable', change: '+12', state: 'Haryana' },
  maize: { name: 'Maize', price: 1870, unit: 'quintal', trend: 'down', change: '-30', state: 'UP' },
  cotton: { name: 'Cotton', price: 6620, unit: 'quintal', trend: 'up', change: '+120', state: 'Gujarat' },
  soybean: { name: 'Soybean', price: 4600, unit: 'quintal', trend: 'up', change: '+85', state: 'MP' },
  mustard: { name: 'Mustard', price: 5650, unit: 'quintal', trend: 'stable', change: '+20', state: 'Rajasthan' },
  sugarcane: { name: 'Sugarcane', price: 340, unit: 'quintal', trend: 'stable', change: '0', state: 'UP' },
  tomato: { name: 'Tomato', price: 1200, unit: 'quintal', trend: 'down', change: '-200', state: 'Maharashtra' },
  onion: { name: 'Onion', price: 800, unit: 'quintal', trend: 'up', change: '+150', state: 'Maharashtra' },
  potato: { name: 'Potato', price: 600, unit: 'quintal', trend: 'stable', change: '+10', state: 'UP' },
  bajra: { name: 'Bajra', price: 2350, unit: 'quintal', trend: 'up', change: '+60', state: 'Rajasthan' },
  jowar: { name: 'Jowar', price: 3180, unit: 'quintal', trend: 'stable', change: '+25', state: 'Karnataka' },
};

router.get('/prices', protect, (req, res) => {
  const prices = Object.values(cropPrices).map(c => ({
    ...c,
    weekHigh: c.price + Math.floor(Math.random() * 100),
    weekLow: c.price - Math.floor(Math.random() * 100),
    msp: Math.floor(c.price * 0.88),
  }));
  res.json({ success: true, prices, lastUpdated: new Date().toLocaleString('en-IN') });
});

router.get('/prices/:crop', protect, (req, res) => {
  const crop = req.params.crop.toLowerCase();
  const data = cropPrices[crop];
  if (!data) return res.status(404).json({ message: 'Crop not found' });

  const history = Array.from({ length: 7 }, (_, i) => ({
    day: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-IN', { weekday: 'short' }),
    price: data.price + Math.floor(Math.random() * 200 - 100),
  }));

  const recommendation = data.trend === 'up'
    ? '📈 Price is rising — consider holding stock for better returns'
    : data.trend === 'down'
    ? '📉 Price is falling — consider selling soon before further decline'
    : '➡️ Price is stable — good time to sell at current rates';

  res.json({ success: true, crop: { ...data, history, recommendation } });
});

module.exports = router;