const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/drones', require('./routes/drones'));
app.use('/api/flights', require('./routes/flights'));
app.use('/api/alerts', require('./routes/alerts'));

// Route kryesore
app.get('/', (req, res) => {
  res.json({ message: 'Drone Management API është aktive!' });
});

// Lidhja me MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/drone_management';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB u lidh me sukses');
    app.listen(PORT, () => {
      console.log(`🚀 Serveri po funksionon në portin ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Gabim në lidhjen me MongoDB:', err.message);
    process.exit(1);
  });

module.exports = app;
