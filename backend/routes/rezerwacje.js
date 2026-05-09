const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Rezerwacja = require('../models/Rezerwacja');
const Parking = require('../models/Parking');
const Pojazd = require('../models/Pojazd');

router.post('/', auth, async (req, res) => {
    try {
        const { parkingId, pojazdId, dataOd, dataDo } = req.body;
        const parking = await Parking.findById(parkingId);
        const pojazd = await Pojazd.findOne({ _id: pojazdId, wlascicielId: req.user.id });

        if (!pojazd) return res.status(404).json({ message: 'Nie znaleziono Twojego pojazdu.' });

        const nowaRezerwacja = new Rezerwacja({
            uzytkownikId: req.user.id,
            pojazdId,
            parkingId,
            dataOd: new Date(dataOd),
            dataDo: new Date(dataDo),
            status: 'aktywna'
        });

        await nowaRezerwacja.save();
        res.status(201).json(nowaRezerwacja);
    } catch (err) {
        res.status(500).json({ message: 'Błąd zapisu rezerwacji' });
    }
});

router.get('/moje', auth, async (req, res) => {
    try {
        const rezerwacje = await Rezerwacja.find({ uzytkownikId: req.user.id })
            .populate('parkingId', 'nazwa adres')
            .populate('pojazdId', 'marka model numer_rejestracyjny')
            .sort({ dataOd: -1 });
        res.json(rezerwacje);
    } catch (err) {
        res.status(500).json({ message: 'Błąd pobierania' });
    }
});

module.exports = router;