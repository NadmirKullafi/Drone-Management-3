const mongoose = require('mongoose');

const FlightSchema = new mongoose.Schema({
  droni: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drone',
    required: true
  },
  operatori: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  statusi: {
    type: String,
    enum: ['planifikuar', 'aktiv', 'kompletuar', 'anuluar', 'dështuar'],
    default: 'planifikuar'
  },
  fillimi: {
    type: Date,
    required: true
  },
  mbarimi: {
    type: Date
  },
  kohezgjatja: {
    type: Number, // minuta
    default: 0
  },
  distancaFluturuar: {
    type: Number, // km
    default: 0
  },
  lartesiaMax: {
    type: Number, // metra
    default: 0
  },
  destinacioni: {
    emri: String,
    lat: Number,
    lng: Number
  },
  qellimiMisionit: {
    type: String,
    enum: ['vëzhgim', 'dorëzim', 'fotografim', 'kërkim_shpëtim', 'inspektim', 'tjetër'],
    default: 'vëzhgim'
  },
  bateriaFillim: {
    type: Number,
    min: 0,
    max: 100
  },
  bateriaMbarim: {
    type: Number,
    min: 0,
    max: 100
  },
  ngarkesa: {
    type: Number, // kg
    default: 0
  },
  koordinatat: [{
    lat: Number,
    lng: Number,
    koha: Date,
    lartesia: Number
  }],
  verejtime: {
    type: String,
    default: ''
  },
  suksesshme: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Llogarit kohëzgjatjen automatikisht
FlightSchema.pre('save', function(next) {
  if (this.fillimi && this.mbarimi) {
    const diff = new Date(this.mbarimi) - new Date(this.fillimi);
    this.kohezgjatja = Math.round(diff / 60000); // ktheje në minuta
  }
  next();
});

module.exports = mongoose.model('Flight', FlightSchema);
