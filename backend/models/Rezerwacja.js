const mongoose = require('mongoose');

const RezerwacjaSchema = new mongoose.Schema({
  uzytkownikId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  parkingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parking' },
  pojazdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pojazd' },
  dataOd: Date,
  dataDo: Date,
  koszt: Number,
  status: String // np. "aktywna", "anulowana", "zakonczona"
});
module.exports = mongoose.model('Rezerwacja', RezerwacjaSchema);