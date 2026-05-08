const mongoose = require('mongoose');

const ParkingSchema = new mongoose.Schema({
  nazwa: String,
  opis: String,
  adres: String,
  miasto: String,
  typ: String, // "naziemny", "podziemny"
  cenaZaGodzine: Number,
  status: String, // "otwarty"
  liczbaMiejsc: Number,
  lat: Number,
  lng: Number
});
module.exports = mongoose.model('Parking', ParkingSchema);