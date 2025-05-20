const jwt = require('jsonwebtoken');

// Token doğrulama middleware
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Giriş yapılmamış' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // userId ve role burada taşınıyor
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token geçersiz' });
  }
};

module.exports = {
  verifyToken
};
