const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Brak autoryzacji' });

  try {
    // Prosta weryfikacja dla prototypu
    if (token === 'przykładowy_token_jwt') {
      req.user = { id: '69dff97c7ed49a3783a81b75' }; // ID z Twojej bazy
      return next();
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token nieprawidłowy' });
  }
};