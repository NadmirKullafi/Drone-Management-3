const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  emri: {
    type: String,
    required: [true, 'Emri është i detyrueshëm'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email-i është i detyrueshëm'],
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Email-i nuk është valid']
  },
  fjalekalimi: {
    type: String,
    required: [true, 'Fjalëkalimi është i detyrueshëm'],
    minlength: 6,
    select: false
  },
  roli: {
    type: String,
    enum: ['admin', 'operator', 'vëzhgues'],
    default: 'operator'
  },
  aktiv: {
    type: Boolean,
    default: true
  },
  foto: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Enkriptimi i fjalëkalimit para ruajtjes
UserSchema.pre('save', async function(next) {
  if (!this.isModified('fjalekalimi')) return next();
  const salt = await bcrypt.genSalt(10);
  this.fjalekalimi = await bcrypt.hash(this.fjalekalimi, salt);
  next();
});

// Metoda për krahasimin e fjalëkalimit
UserSchema.methods.krahasoFjalekalimin = async function(fjalekalimiFutur) {
  return await bcrypt.compare(fjalekalimiFutur, this.fjalekalimi);
};

module.exports = mongoose.model('User', UserSchema);
