const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/authMiddleware');

// Farming advice based on weather
const getFarmingAdvice = (temp, humidity, condition) => {
  let advice = [];

  if (temp > 35) {
    advice.push('🌡️ Very hot — irrigate crops early morning or evening');
  } else if (temp < 10) {
    advice.push('🥶 Very cold — protect crops from frost damage');
  } else {
    advice.push('🌤️ Temperature is ideal for most crops');
  }

  if (humidity > 80) {
    advice.push('💧 High humidity — watch out for fungal diseases');
  } else if (humidity < 30) {
    advice.push('🏜️ Low humidity — increase irrigation');
  }

  if (condition === 'Rain') {
    advice.push('🌧️ Rain expected — avoid fertilizer application today');
  } else if (condition === 'Clear') {
    advice.push('☀️ Clear weather — good day for pesticide spraying');
  }

  return advice;
};

// @route GET /api/weather/:city
router.get('/:city', protect, async (req, res) => {
  console.log('API KEY:', process.env.WEATHER_API_KEY);
  try {
    const city = req.params.city;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: '❌ Weather API key not found in .env' });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = response.data;

    const weather = {
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      windSpeed: data.wind.speed,
      rainfall: data.rain ? data.rain['1h'] || 0 : 0,
      farmingAdvice: getFarmingAdvice(
        data.main.temp,
        data.main.humidity,
        data.weather[0].main
      )
    };

    res.json({ success: true, weather });

  } catch (error) {
    console.log('Weather API Error:', error.response?.data || error.message);
    res.status(500).json({
      message: '❌ City not found or API error',
      error: error.response?.data || error.message
    });
  }
});

module.exports = router;
