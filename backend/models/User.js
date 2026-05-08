const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  haslo: { type: String, required: true },
  rola: { type: String, default: 'kierowca' } // 'kierowca' lub 'admin'
});
module.exports = mongoose.model('User', UserSchema);