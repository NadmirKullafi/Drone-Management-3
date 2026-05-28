const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Gjenero JWT Token
const gjeneraToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'drone_secret_key_2024', {
    expiresIn: '7d'
  });
};

// @desc    Regjistro përdorues të ri
// @route   POST /api/auth/regjistro
// @access  Public
const regjistro = async (req, res) => {
  try {
    const { emri, email, fjalekalimi, roli } = req.body;

    const ekziston = await User.findOne({ email });
    if (ekziston) {
      return res.status(400).json({ sukses: false, mesazhi: 'Ky email është i regjistruar tashmë.' });
    }

    const perdoruesi = await User.create({ emri, email, fjalekalimi, roli });
    const token = gjeneraToken(perdoruesi._id);

    res.status(201).json({
      sukses: true,
      token,
      perdoruesi: {
        id: perdoruesi._id,
        emri: perdoruesi.emri,
        email: perdoruesi.email,
        roli: perdoruesi.roli
      }
    });
  } catch (err) {
    res.status(500).json({ sukses: false, mesazhi: err.message });
  }
};

// @desc    Hyrje / Login
// @route   POST /api/auth/hyrje
// @access  Public
const hyrje = async (req, res) => {
  try {
    const { email, fjalekalimi } = req.body;

    if (!email || !fjalekalimi) {
      return res.status(400).json({ sukses: false, mesazhi: 'Ju lutem plotësoni të gjitha fushat.' });
    }

    const perdoruesi = await User.findOne({ email }).select('+fjalekalimi');
    if (!perdoruesi) {
      return res.status(401).json({ sukses: false, mesazhi: 'Email ose fjalëkalim i gabuar.' });
    }

    const fjalekalimKorrekt = await perdoruesi.krahasoFjalekalimin(fjalekalimi);
    if (!fjalekalimKorrekt) {
      return res.status(401).json({ sukses: false, mesazhi: 'Email ose fjalëkalim i gabuar.' });
    }

    const token = gjeneraToken(perdoruesi._id);

    res.json({
      sukses: true,
      token,
      perdoruesi: {
        id: perdoruesi._id,
        emri: perdoruesi.emri,
        email: perdoruesi.email,
        roli: perdoruesi.roli
      }
    });
  } catch (err) {
    res.status(500).json({ sukses: false, mesazhi: err.message });
  }
};

// @desc    Merr profilin e përdoruesit aktual
// @route   GET /api/auth/profili
// @access  Private
const merrProfil = async (req, res) => {
  res.json({ sukses: true, perdoruesi: req.perdoruesi });
};

// @desc    Përditëso profilin
// @route   PUT /api/auth/profili
// @access  Private
const perditesoProfil = async (req, res) => {
  try {
    const { emri, email } = req.body;
    const perdoruesi = await User.findByIdAndUpdate(
      req.perdoruesi._id,
      { emri, email },
      { new: true, runValidators: true }
    );
    res.json({ sukses: true, perdoruesi });
  } catch (err) {
    res.status(500).json({ sukses: false, mesazhi: err.message });
  }
};

module.exports = { regjistro, hyrje, merrProfil, perditesoProfil };
