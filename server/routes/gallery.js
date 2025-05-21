const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getAllImages, uploadImage } = require('../controllers/galleryController');
const { verifyToken } = require('../middleware');

// 📦 DÜZELTİLMİŞ: Multer disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // ✅ doğru path burası
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Tüm görseller (public)
router.get('/', getAllImages);

// Admin görsel yükler
router.post('/upload', verifyToken, upload.single('image'), uploadImage);

const fs = require('fs');

// Görsel sil
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const Gallery = require('../models/Gallery');
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Görsel bulunamadı' });

    // Dosya sisteminden sil
    const filePath = path.join(__dirname, '..', image.imageUrl.replace(/^\/+/, ''));
    fs.unlink(filePath, err => {
      if (err) console.error('Dosya silinemedi:', err);
    });

    // MongoDB’den sil
    await image.deleteOne();
    res.json({ message: 'Görsel silindi' });
  } catch (err) {
    console.error('Silme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});



module.exports = router;
