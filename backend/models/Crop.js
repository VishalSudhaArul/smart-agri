const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cropName: {
    type: String,
    required: true
  },
  landSize: {
    type: Number,
    required: true  // in acres
  },
  soilType: {
    type: String,
    enum: ['sandy', 'clay', 'loamy', 'silty', 'peaty'],
    required: true
  },
  season: {
    type: String,
    enum: ['kharif', 'rabi', 'zaid'],
    required: true
  },
  region: {
    state: String,
    district: String
  },
  sowingDate: {
    type: Date
  },
  irrigationType: {
    type: String,
    enum: ['drip', 'sprinkler', 'flood', 'rainfed'],
    default: 'rainfed'
  },
  status: {
    type: String,
    enum: ['planning', 'growing', 'harvested'],
    default: 'planning'
  }
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);