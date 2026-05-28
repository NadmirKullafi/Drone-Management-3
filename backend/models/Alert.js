const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  droni: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drone'
  },
  lloji: {
    type: String,
    enum: ['bateri_ulët', 'sinyal_humbur', 'zonë_e_ndaluar', 'motor_defekt', 'mot_i_keq', 'kolizion', 'tjetër'],
    required: true
  },
  mesazhi: {
    type: String,
    required: true
  },
  prioriteti: {
    type: String,
    enum: ['i_ulët', 'mesatar', 'i_lartë', 'kritik'],
    default: 'mesatar'
  },
  lexuar: {
    type: Boolean,
    default: false
  },
  zgjidhur: {
    type: Boolean,
    default: false
  },
  koha: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Alert', AlertSchema);
