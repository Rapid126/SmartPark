const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');
  
  // Sprawdzamy czy nagłówek w ogóle przyszedł
  if (!authHeader) {
    return res.status(401).json({ message: 'Brak nagłówka Authorization.' });
  }

  // Wyciągamy sam kod (wyrzucamy słowo 'Bearer ')
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Brak tokena w nagłówku.' });
  }

  try {
    // Weryfikacja prawdziwego JWT
    const secret = process.env.JWT_SECRET || 'super_sekretny_klucz_zpsm';
    const decoded = jwt.verify(token, secret);
    
    // Zapisujemy ID użytkownika, żeby inne trasy mogły go użyć
    req.user = decoded; 
    next();
  } catch (err) {
    console.log("Szczegóły błędu tokena:", err.message);
    res.status(401).json({ message: 'Token jest nieprawidłowy (malformed lub wygasł).' });
  }
};