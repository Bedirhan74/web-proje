const express = require('express');
const router = express.Router();
const {
  getAllAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementBySlug
} = require('../controllers/announcementController');
const { verifyToken } = require('../middleware');
const Announcement = require('../models/Announcement');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// ✅ Herkes görebilir
router.get('/', getAllAnnouncements);

// ✅ Slug ile duyuru getir
router.get('/slug/:slug', getAnnouncementBySlug);

// ✅ ID ile tek duyuru getir
router.get('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Duyuru bulunamadı' });
    res.json(announcement);
  } catch (err) {
    console.error('ID ile duyuru alınamadı:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// ✅ Yeni duyuru oluştur (sadece admin)
router.post('/', verifyToken, csrfProtection, createAnnouncement);

// ✅ Duyuru sil (sadece admin)
router.delete('/:id', verifyToken, csrfProtection, deleteAnnouncement);

// ✅ Duyuru güncelle (sadece admin)
router.put('/:id', verifyToken, csrfProtection, async (req, res) => {
  const { title, content } = req.body;

  try {
    const updated = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Duyuru bulunamadı' });

    res.json(updated);
  } catch (err) {
    console.error('Duyuru güncelleme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
