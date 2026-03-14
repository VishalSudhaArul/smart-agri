const mongoose = require('mongoose');

const CropCalendarSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cropName: { type: String, required: true },
  sowingDate: { type: Date, required: true },
  season: String,
  landSize: String,
  events: [{
    title: String,
    date: Date,
    type: { type: String, enum: ['sowing', 'fertilizer', 'irrigation', 'pesticide', 'harvest'] },
    done: { type: Boolean, default: false },
    notes: String,
  }]
}, { timestamps: true });

module.exports = mongoose.model('CropCalendar', CropCalendarSchema);