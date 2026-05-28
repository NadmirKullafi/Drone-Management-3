const Flight = require('../models/Flight');
const Drone = require('../models/Drone');

// @desc    Merr të gjitha fluturimet
// @route   GET /api/flights
// @access  Private
const merrFluturimet = async (req, res) => {
  try {
    const { statusi, droniId, faqja = 1, limit = 10 } = req.query;
    const filtri = {};

    if (statusi) filtri.statusi = statusi;
    if (droniId) filtri.droni = droniId;

    const total = await Flight.countDocuments(filtri);
    const fluturimet = await Flight.find(filtri)
      .populate('droni', 'emri modeli numriSerial')
      .populate('operatori', 'emri email')
      .skip((faqja - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      sukses: true,
      total,
      faqja: parseInt(faqja),
      faqjet: Math.ceil(total / limit),
      fluturimet
    });
  } catch (err) {
    res.status(500).json({ sukses: false, mesazhi: err.message });
  }
};

// @desc    Statistika të fluturimeve
// @route   GET /api/flights/statistika
// @access  Private
const merrStatistika = async (req, res) => {
  try {
    const total = await Flight.countDocuments();
    const aktive = await Flight.countDocuments({ statusi: 'aktiv' });
    const kompletuara = await Flight.countDocuments({ statusi: 'kompletuar' });
    const destuara = await Flight.countDocuments({ statusi: 'dështuar' });

    const agregimi = await Flight.aggregate([
      { $match: { statusi: 'kompletuar' } },
      {
        $group: {
          _id: null,
          distancaTotal: { $sum: '$distancaFluturuar' },
          kohaTotale: { $sum: '$kohezgjatja' }
        }
      }
    ]);

    const totalet = agregimi[0] || { distancaTotal: 0, kohaTotale: 0 };

    res.json({
      sukses: true,
      statistika: {
        total, aktive, kompletuara, destuara,
        distancaTotal: Math.round(totalet.distancaTotal),
        kohaTotale: Math.round(totalet.kohaTotale)
      }
    });
  } catch (err) {
    res.status(500).json({ sukses: false, mesazhi: err.message });
  }
};

// @desc    Merr fluturimin specifik
// @route   GET /api/flights/:id
// @access  Private
const merrFluturimin = async (req, res) => {
  try {
    const fluturimi = await Flight.findById(req.params.id)
      .populate('droni', 'emri modeli numriSerial')
      .populate('operatori', 'emri email');

    if (!fluturimi) {
      return res.status(404).json({ sukses: false, mesazhi: 'Fluturimi nuk u gjet.' });
    }
    res.json({ sukses: true, fluturimi });
  } catch (err) {
    res.status(500).json({ sukses: false, mesazhi: err.message });
  }
};

// @desc    Krijo fluturim të ri
// @route   POST /api/flights
// @access  Private
const krijo = async (req, res) => {
  try {
    const droni = await Drone.findById(req.body.droni);
    if (!droni) {
      return res.status(404).json({ sukses: false, mesazhi: 'Droni nuk u gjet.' });
    }
    if (droni.statusi === 'në_fluturim') {
      return res.status(400).json({ sukses: false, mesazhi: 'Droni është tashmë në fluturim.' });
    }
    if (droni.statusi === 'mirëmbajtje' || droni.statusi === 'i_dëmtuar') {
      return res.status(400).json({ sukses: false, mesazhi: 'Droni nuk është i disponueshëm.' });
    }

    const fluturimi = await Flight.create({
      ...req.body,
      operatori: req.perdoruesi._id,
      bateriaFillim: droni.bateria
    });

    await Drone.findByIdAndUpdate(req.body.droni, { statusi: 'në_fluturim' });

    res.status(201).json({ sukses: true, fluturimi });
  } catch (err) {
    res.status(400).json({ sukses: false, mesazhi: err.message });
  }
};

// @desc    Përfundo fluturimin
// @route   PUT /api/flights/:id/perfundo
// @access  Private
const perfundo = async (req, res) => {
  try {
    const { bateriaMbarim, distancaFluturuar, lartesiaMax, verejtime, suksesshme } = req.body;

    const fluturimi = await Flight.findById(req.params.id);
    if (!fluturimi) {
      return res.status(404).json({ sukses: false, mesazhi: 'Fluturimi nuk u gjet.' });
    }

    fluturimi.statusi = suksesshme !== false ? 'kompletuar' : 'dështuar';
    fluturimi.mbarimi = new Date();
    fluturimi.bateriaMbarim = bateriaMbarim;
    fluturimi.distancaFluturuar = distancaFluturuar || 0;
    fluturimi.lartesiaMax = lartesiaMax || 0;
    fluturimi.verejtime = verejtime || '';
    fluturimi.suksesshme = suksesshme !== false;
    await fluturimi.save();

    const kohezgjatja = fluturimi.kohezgjatja / 60;
    await Drone.findByIdAndUpdate(fluturimi.droni, {
      statusi: 'aktiv',
      bateria: bateriaMbarim || 100,
      $inc: {
        fluturimeTotale: 1,
        oretFluturimit: kohezgjatja
      }
    });

    res.json({ sukses: true, fluturimi });
  } catch (err) {
    res.status(500).json({ sukses: false, mesazhi: err.message });
  }
};

// @desc    Fshi fluturimin
// @route   DELETE /api/flights/:id
// @access  Private
const fshi = async (req, res) => {
  try {
    await Flight.findByIdAndDelete(req.params.id);
    res.json({ sukses: true, mesazhi: 'Fluturimi u fshi me sukses.' });
  } catch (err) {
    res.status(500).json({ sukses: false, mesazhi: err.message });
  }
};

module.exports = { merrFluturimet, merrStatistika, merrFluturimin, krijo, perfundo, fshi };
