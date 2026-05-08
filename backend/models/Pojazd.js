const mongoose = require('mongoose');

const PojazdSchema = new mongoose.Schema({
  wlascicielId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  marka: String,
  model: String,
  numer_rejestracyjny: String
});
module.exports = mongoose.model('Pojazd', PojazdSchema);