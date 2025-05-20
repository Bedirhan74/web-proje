const Announcement = require('../models/Announcement');

// ✅ Tüm duyuruları getir
const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    console.error('Duyuru listeleme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// ✅ Yeni duyuru oluştur
const createAnnouncement = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Başlık ve içerik zorunludur' });
  }

  try {
    const newAnnouncement = new Announcement({ title, content });
    await newAnnouncement.save();
    res.status(201).json({ message: 'Duyuru oluşturuldu', announcement: newAnnouncement });
  } catch (err) {
    console.error('Duyuru oluşturma hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// ✅ Duyuru sil
const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;

  try {
    await Announcement.findByIdAndDelete(id);
    res.json({ message: 'Duyuru silindi' });
  } catch (err) {
    console.error('Duyuru silme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};


// Slug ile duyuru getir
const getAnnouncementBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const announcement = await Announcement.findOne({ slug });

    if (!announcement) {
      return res.status(404).json({ message: 'Duyuru bulunamadı' });
    }

    res.json(announcement);
  } catch (err) {
    console.error('Slug ile duyuru hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};



module.exports = {
  getAllAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementBySlug
};
