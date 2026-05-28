const jwt = require('jsonwebtoken');
const User = require('../models/User');

const mbrojtAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ sukses: false, mesazhi: 'Nuk jeni të autorizuar. Token mungon.' });
  }

  try {
    const dekoduar = jwt.verify(token, process.env.JWT_SECRET || 'drone_secret_key_2024');
    req.perdoruesi = await User.findById(dekoduar.id);
    if (!req.perdoruesi) {
      return res.status(401).json({ sukses: false, mesazhi: 'Përdoruesi nuk u gjet.' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ sukses: false, mesazhi: 'Token i pavlefshëm.' });
  }
};

const vetemAdmin = (req, res, next) => {
  if (req.perdoruesi.roli !== 'admin') {
    return res.status(403).json({ sukses: false, mesazhi: 'Vetëm administratori mund të kryejë këtë veprim.' });
  }
  next();
};

module.exports = { mbrojtAuth, vetemAdmin };
