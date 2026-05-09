const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Pojazd = require('../models/Pojazd');

// [GET] Pobierz listę aut zalogowanego użytkownika
router.get('/', auth, async (req, res) => {
    try {
        const pojazdy = await Pojazd.find({ wlascicielId: req.user.id });
        res.json(pojazdy);
    } catch (err) {
        res.status(500).json({ message: 'Błąd serwera' });
    }
});

// [POST] Dodaj nowy pojazd
router.post('/', auth, async (req, res) => {
    try {
        const { marka, model, rejestracja } = req.body;
        const istniejacyPojazd = await Pojazd.findOne({ numer_rejestracyjny: rejestracja });
        if (istniejacyPojazd) return res.status(400).json({ message: 'Pojazd o takiej rejestracji już istnieje' });

        const nowyPojazd = new Pojazd({
            marka, model, numer_rejestracyjny: rejestracja,
            wlascicielId: req.user.id
        });
        await nowyPojazd.save();
        res.status(201).json(nowyPojazd);
    } catch (err) {
        res.status(500).json({ message: 'Błąd podczas dodawania pojazdu' });
    }
});

module.exports = router;