const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin Login
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Kullanıcı bulunamadı' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Şifre yanlış' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 gün
    });

    res.json({ message: 'Giriş başarılı', user: { username: user.username, role: user.role } });
  } catch (err) {
    console.error('Login hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Admin Logout
const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Çıkış başarılı' });
};

// Geçici Admin Register
const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Bu kullanıcı zaten var' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      role: 'admin'
    });

    await newUser.save();

    res.status(201).json({ message: 'Kullanıcı oluşturuldu' });
  } catch (err) {
    console.error('Register hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

module.exports = { login, logout, register };
