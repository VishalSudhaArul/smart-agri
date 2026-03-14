const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const CropCalendar = require('../models/CropCalendar');

const generateEvents = (cropName, sowingDate) => {
  const sow = new Date(sowingDate);
  const addDays = (d, n) => new Date(d.getTime() + n * 86400000);

  const schedules = {
    wheat: [
      { title: 'Sowing Day', days: 0, type: 'sowing' },
      { title: 'First Irrigation', days: 21, type: 'irrigation' },
      { title: 'Urea Top Dressing', days: 25, type: 'fertilizer' },
      { title: 'Second Irrigation', days: 45, type: 'irrigation' },
      { title: 'Pesticide Spray', days: 60, type: 'pesticide' },
      { title: 'Third Irrigation', days: 70, type: 'irrigation' },
      { title: 'Pre-Harvest Check', days: 100, type: 'pesticide' },
      { title: 'Harvest Time', days: 120, type: 'harvest' },
    ],
    rice: [
      { title: 'Nursery Sowing', days: 0, type: 'sowing' },
      { title: 'Transplanting', days: 30, type: 'sowing' },
      { title: 'First Fertilizer', days: 40, type: 'fertilizer' },
      { title: 'Weed Control', days: 50, type: 'pesticide' },
      { title: 'Second Fertilizer', days: 60, type: 'fertilizer' },
      { title: 'Pest Control', days: 75, type: 'pesticide' },
      { title: 'Harvest Time', days: 110, type: 'harvest' },
    ],
    default: [
      { title: 'Sowing Day', days: 0, type: 'sowing' },
      { title: 'First Irrigation', days: 15, type: 'irrigation' },
      { title: 'First Fertilizer', days: 20, type: 'fertilizer' },
      { title: 'Pest Control', days: 40, type: 'pesticide' },
      { title: 'Second Irrigation', days: 45, type: 'irrigation' },
      { title: 'Second Fertilizer', days: 55, type: 'fertilizer' },
      { title: 'Harvest Time', days: 90, type: 'harvest' },
    ]
  };

  const schedule = schedules[cropName.toLowerCase()] || schedules.default;
  return schedule.map(e => ({
    title: e.title,
    date: addDays(sow, e.days),
    type: e.type,
    done: false,
    notes: ''
  }));
};

router.post('/add', protect, async (req, res) => {
  try {
    const { cropName, sowingDate, season, landSize } = req.body;
    const events = generateEvents(cropName, sowingDate);
    const calendar = await CropCalendar.create({
      userId: req.user._id, cropName, sowingDate, season, landSize, events
    });
    res.json({ success: true, calendar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-calendars', protect, async (req, res) => {
  try {
    const calendars = await CropCalendar.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, calendars });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/mark-done/:calendarId/:eventIndex', protect, async (req, res) => {
  try {
    const calendar = await CropCalendar.findById(req.params.calendarId);
    calendar.events[req.params.eventIndex].done = true;
    await calendar.save();
    res.json({ success: true, calendar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;