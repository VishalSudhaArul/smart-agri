const Crop = require('../models/Crop');

// @route POST /api/crop/add
const addCrop = async (req, res) => {
  try {
    const {
      cropName, landSize, soilType,
      season, region, sowingDate,
      irrigationType
    } = req.body;

    const crop = await Crop.create({
      userId: req.user._id,
      cropName, landSize, soilType,
      season, region, sowingDate,
      irrigationType
    });

    res.status(201).json({ success: true, crop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/crop/my-crops
const getMyCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ userId: req.user._id })
                            .sort({ createdAt: -1 });
    res.json({ success: true, crops });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/crop/:id
const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: '❌ Crop not found' });
    }
    res.json({ success: true, crop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/crop/:id
const deleteCrop = async (req, res) => {
  try {
    await Crop.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: '✅ Crop deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addCrop, getMyCrops, getCropById, deleteCrop };