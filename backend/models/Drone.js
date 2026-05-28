const mongoose = require('mongoose');

const DroneSchema = new mongoose.Schema({
  emri: {
    type: String,
    required: [true, 'Emri i dronit është i detyrueshëm'],
    trim: true
  },
  modeli: {
    type: String,
    required: [true, 'Modeli është i detyrueshëm']
  },
  numriSerial: {
    type: String,
    required: true,
    unique: true
  },
  statusi: {
    type: String,
    enum: ['aktiv', 'në_fluturim', 'mirëmbajtje', 'joaktiv', 'i_dëmtuar'],
    default: 'aktiv'
  },
  bateria: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  pesha: {
    type: Number, // në kg
    required: true
  },
  ngarkesaMax: {
    type: Number, // në kg
    required: true
  },
  kohaMaksimaleFluturimit: {
    type: Number, // në minuta
    required: true
  },
  shpejtesiaMax: {
    type: Number, // km/h
    required: true
  },
  rangu: {
    type: Number, // në km
    required: true
  },
  kamera: {
    type: Boolean,
    default: true
  },
  gps: {
    type: Boolean,
    default: true
  },
  pozicioni: {
    lat: { type: Number, default: 41.3275 },
    lng: { type: Number, default: 19.8187 }
  },
  operatori: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fluturimeTotale: {
    type: Number,
    default: 0
  },
  oretFluturimit: {
    type: Number,
    default: 0
  },
  dataRegjistimit: {
    type: Date,
    default: Date.now
  },
  dataRevizionit: {
    type: Date
  },
  imazhi: {
    type: String,
    default: ''
  },
  shenimet: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Drone', DroneSchema);
