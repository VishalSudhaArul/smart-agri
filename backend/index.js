const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://smart-agri.vercel.app',
    'https://smart-agri-frontend.vercel.app'
  ]
}));
app.use(express.json());

// Static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/crop', require('./routes/crop'));
app.use('/api/soil', require('./routes/soil'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/yield', require('./routes/yield'));
app.use('/api/advisory', require('./routes/advisory'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/disease', require('./routes/disease'));

// Health check
app.get('/', (req, res) => {
  res.send('🌾 Smart Agri API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));