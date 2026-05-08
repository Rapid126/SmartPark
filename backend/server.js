require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Import modeli
const User = require('./models/User');
const Parking = require('./models/Parking');
const Pojazd = require('./models/Pojazd');
const Rezerwacja = require('./models/Rezerwacja');

// Połączenie z MongoDB 
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Połączono z MongoDB Atlas'))
  .catch((err) => console.error('Błąd połączenia z MongoDB:', err));

// --- Przykładowe Endpoints (Zgodnie z dokumentacją) ---

// UC-01: Logowanie [cite: 157]
app.post('/api/auth/login', async (req, res) => {
  const { email, haslo } = req.body;
  // Tutaj w rzeczywistości używamy bcrypt.compare
  const user = await User.findOne({ email });
  if (!user || user.haslo !== haslo) { // Uproszczenie dla prototypu
    return res.status(401).json({ error: 'Błędne dane logowania' });
  }
  // Tutaj generujemy token JWT
  res.json({ token: 'przykładowy_token_jwt', user: { id: user._id, email: user.email, rola: user.rola } });
});

// Pobieranie parkingów dla Mapy (Ekran Główny) [cite: 289]
app.get('/api/parkings', async (req, res) => {
  const parkings = await Parking.find();
  res.json(parkings);
});

// UC-02: Rezerwacja miejsca [cite: 162]
app.post('/api/rezerwacje', async (req, res) => {
    const { uzytkownikId, parkingId, pojazdId, dataDo, koszt } = req.body;
    const nowaRezerwacja = new Rezerwacja({
        uzytkownikId, parkingId, pojazdId, dataOd: new Date(), dataDo, koszt, status: 'aktywna'
    });
    await nowaRezerwacja.save();
    res.status(201).json(nowaRezerwacja);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));