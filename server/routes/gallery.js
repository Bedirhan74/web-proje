const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getAllImages, uploadImage } = require('../controllers/galleryController');
const { verifyToken } = require('../middleware');

// Upload ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Herkese açık listeleme
router.get('/', getAllImages);

// Sadece giriş yapmış admin yükleyebilir
router.post('/upload', verifyToken, upload.single('image'), uploadImage);

module.exports = router;
