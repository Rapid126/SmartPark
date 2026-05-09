require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const User = require('./models/User');
const Parking = require('./models/Parking');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Połączono z MongoDB Atlas'))
  .catch(err => console.error(err));

// --- LOGOWANIE ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, haslo } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Błędne dane logowania' });

    const isMatch = await bcrypt.compare(haslo, user.haslo);
    if (!isMatch) return res.status(401).json({ message: 'Błędne dane logowania' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'super_sekretny_klucz_zpsm', { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// --- REJESTRACJA ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, haslo } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(haslo, salt);
    const newUser = new User({ email, haslo: hashed, rola: 'kierowca' });
    await newUser.save();
    res.status(201).json({ message: 'Zarejestrowano pomyślnie' });
  } catch (err) {
    res.status(500).json({ message: 'Błąd rejestracji' });
  }
});

app.get('/api/parkings', async (req, res) => {
  const parkings = await Parking.find();
  res.json(parkings);
});

app.use('/api/rezerwacje', require('./routes/rezerwacje'));
app.use('/api/pojazdy', require('./routes/pojazdy'));

app.listen(5000, () => console.log('Serwer działa na porcie 5000'));