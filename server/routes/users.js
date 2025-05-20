const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { verifyToken } = require('../middleware');

// GET: Tüm adminleri getir
router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, 'username role createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// POST: Yeni admin oluştur
router.post('/', verifyToken, async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Bu kullanıcı zaten var' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashed, role: 'admin' });
    await newUser.save();
    res.status(201).json({ message: 'Admin eklendi' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// DELETE: Admin sil
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin silindi' });
  } catch (err) {
    res.status(500).json({ message: 'Silme hatası' });
  }
});

module.exports = router;
