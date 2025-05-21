const Gallery = require('../models/Gallery');
const fs = require('fs');
const path = require('path');

// 📥 Tüm resimleri getir
const getAllImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    console.error('Resim listeleme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// 📤 Yeni resim yükle
const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Dosya yüklenmedi' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  const title = req.body.title || '';
  const description = req.body.description || '';

  try {
    const newImage = new Gallery({ imageUrl, title, description });
    await newImage.save();
    res.status(201).json({ message: 'Resim yüklendi', image: newImage });
  } catch (err) {
    console.error('Resim kaydetme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// 🗑 Görsel sil
const deleteImage = async (req, res) => {
  const { id } = req.params;

  try {
    const image = await Gallery.findById(id);
    if (!image) return res.status(404).json({ message: 'Görsel bulunamadı' });

    // Dosya sisteminden sil
    const filePath = path.join(__dirname, '..', image.imageUrl);
    fs.unlink(filePath, (err) => {
      if (err) console.error('Dosya silinemedi:', err);
    });

    await image.deleteOne();
    res.json({ message: 'Görsel silindi' });
  } catch (err) {
    console.error('Silme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

module.exports = {
  getAllImages,
  uploadImage,
  deleteImage
};
