const Drone = require('../models/Drone');

// @desc    Merr të gjithë dronat
// @route   GET /api/drones
// @access  Private
const merrDronat = async (req, res) => {
  try {
    const { statusi, faqja = 1, limit = 10, kerkimi } = req.query;
    const filtri = {};

    if (statusi) filtri.statusi = statusi;
    if (kerkimi) {
      filtri.$or = [
        { emri: { $regex: kerkimi, $options: 'i' } },
        { modeli: { $regex: kerkimi, $options: 'i' } },
        { numriSerial: { $regex: kerkimi, $options: 'i' } }
      ];
    }

    const total = await Drone.countDocuments(filtri);
    const dronat = await Drone.find(filtri)
      .populate('operatori', 'emri email')
      .skip((faqja - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      sukses: true,
      total,
      faqja: parseInt(faqja),
      faqjet: Math.ceil(total / limit),
      dronat
    });
  } catch (err) {
    res.status(500).json({ sukses: false, mesazhi: err.message });
  }
};

// @desc    Merr statistikat e dronave
// @route   GET /api/drones/statistika
// @access  Private
const merrStatistika = async (req, res) => {
  try {
    const total = await Drone.countDocuments();
    const aktiv = await Drone.countDocuments({ statusi: 'aktiv' });
    const neFliturim = await Drone.countDocuments({ statusi: 'në_fluturim' });
    const mirembajte = await Drone.countDocuments({ statusi: 'mirëmbajtje' });
    const joaktiv = await Drone.countDocuments({ statusi: 'joaktiv' });
    const demtuar = await Drone.countDocuments({ statusi: 'i_dëmtuar' });
    const bateriaUlet = await Drone.countDocuments({ bateria: { $lt: 20 } });

    res.json({
      sukses: true,
      statistika: { total, aktiv, neFliturim, mirembajte, joaktiv, demtuar, bateriaUlet }
    });
  } catch (err) {
    res.status(500).json({ sukses: false, mesazhi: err.message });
  }
};

// @desc    Merr një dron specifik
// @route   GET /api/drones/:id
// @access  Private
const merrDronin = async (req, res) => {
  try {
    const droni = await Drone.findById(req.params.id).populate('operatori', 'emri email');
    if (!droni) {
      return res.status(404).json({ sukses: false, mesazhi: 'Droni nuk u gjet.' });
    }
    res.json({ sukses: true, droni });
  } catch (err) {
    res.status(500).json({ sukses: false, mesazhi: err.message });
  }
};

// @desc    Shto dron të ri
// @route   POST /api/drones
// @access  Private
const shto = async (req, res) => {
  try {
    const droni = await Drone.create({
      ...req.body,
      operatori: req.perdoruesi._id
    });
    res.status(201).json({ sukses: true, droni });
  } catch (err) {
    res.status(400).json({ sukses: false, mesazhi: err.message });
  }
};

// @desc    Përditëso dronin
// @route   PUT /api/drones/:id
// @access  Private
const perditeso = async (req, res) => {
  try {
    const droni = await Drone.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!droni) {
      return res.status(404).json({ sukses: false, mesazhi: 'Droni nuk u gjet.' });
    }
    res.json({ sukses: true, droni });
  } catch (err) {
    res.status(400).json({ sukses: false, mesazhi: err.message });
  }
};

// @desc    Fshi dronin
// @route   DELETE /api/drones/:id
// @access  Private (Admin)
const fshi = async (req, res) => {
  try {
    const droni = await Drone.findByIdAndDelete(req.params.id);
    if (!droni) {
      return res.status(404).json({ sukses: false, mesazhi: 'Droni nuk u gjet.' });
    }
    res.json({ sukses: true, mesazhi: 'Droni u fshi me sukses.' });
  } catch (err) {
    res.status(500).json({ sukses: false, mesazhi: err.message });
  }
};

// @desc    Përditëso baterinë
// @route   PATCH /api/drones/:id/bateria
// @access  Private
const perditesoBateria = async (req, res) => {
  try {
    const { bateria } = req.body;
    const droni = await Drone.findByIdAndUpdate(
      req.params.id,
      { bateria },
      { new: true }
    );
    res.json({ sukses: true, droni });
  } catch (err) {
    res.status(500).json({ sukses: false, mesazhi: err.message });
  }
};

module.exports = { merrDronat, merrStatistika, merrDronin, shto, perditeso, fshi, perditesoBateria };
