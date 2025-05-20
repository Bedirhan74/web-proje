const Gallery = require('../models/Gallery');

// Tüm resimleri getir
const getAllImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    console.error('Resim listeleme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Yeni resim ekle (multer middleware'den sonra çalışır)
const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Dosya yüklenmedi' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  const caption = req.body.caption || '';

  try {
    const newImage = new Gallery({ imageUrl, caption });
    await newImage.save();
    res.status(201).json({ message: 'Resim yüklendi', image: newImage });
  } catch (err) {
    console.error('Resim kaydetme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

module.exports = { getAllImages, uploadImage };
