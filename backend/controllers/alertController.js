const Alert = require('../models/Alert');

// @desc    Merr të gjitha alarmet
// @route   GET /api/alerts
// @access  Private
const merrAlarmet = async (req, res) => {
  try {
    const { lexuar, prioriteti } = req.query;
    const filtri = {};
    if (lexuar !== undefined) filtri.lexuar = lexuar === 'true';
    if (prioriteti) filtri.prioriteti = prioriteti;

    const alarmet = await Alert.find(filtri)
      .populate('droni', 'emri modeli')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ sukses: true, alarmet });
  } catch (err) {
    res.status(500).json({ sukses: false, mesazhi: err.message });
  }
};

// @desc    Krijo alarm të ri
// @route   POST /api/alerts
// @access  Private
const krijo = async (req, res) => {
  try {
    const alarmi = await Alert.create(req.body);
    res.status(201).json({ sukses: true, alarmi });
  } catch (err) {
    res.status(400).json({ sukses: false, mesazhi: err.message });
  }
};

// @desc    Shëno alarmin si të lexuar
// @route   PUT /api/alerts/:id/lexo
// @access  Private
const lexo = async (req, res) => {
  try {
    const alarmi = await Alert.findByIdAndUpdate(
      req.params.id,
      { lexuar: true },
      { new: true }
    );
    res.json({ sukses: true, alarmi });
  } catch (err) {
    res.status(500).json({ sukses: false, mesazhi: err.message });
  }
};

// @desc    Zgjidh alarmin
// @route   PUT /api/alerts/:id/zgjidh
// @access  Private
const zgjidh = async (req, res) => {
  try {
    const alarmi = await Alert.findByIdAndUpdate(
      req.params.id,
      { zgjidhur: true, lexuar: true },
      { new: true }
    );
    res.json({ sukses: true, alarmi });
  } catch (err) {
    res.status(500).json({ sukses: false, mesazhi: err.message });
  }
};

module.exports = { merrAlarmet, krijo, lexo, zgjidh };
