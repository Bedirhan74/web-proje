// server/app.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');


const announcementRoutes = require('./routes/announcements');
const galleryRoutes = require('./routes/gallery');
const path = require('path');
const statsRoutes = require('./routes/stats');
const authRoutes = require('./routes/auth');
const { verifyToken } = require('./middleware');
const users = require('./routes/users');


dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // frontend portu
  credentials: true
}));
app.use(express.json());
app.use(cookieParser()); // CSRF'den önce

// CSRF middleware doğru tanımlanmalı
app.use(csrf({
  cookie: {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false
  }
}));

// CSRF token endpoint'i
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});



app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/gallery', galleryRoutes);
app.use('/api/stats', statsRoutes);

app.use('/api/users', require('./routes/users'));

app.use('/uploads',express.static(path.join(__dirname,'uploads')));





// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB bağlantısı başarılı"))
  .catch(err => console.error("MongoDB bağlantı hatası:", err));

// Basit test endpoint
app.get('/', (req, res) => {
  res.send('Backend çalışıyor!');
});


app.get('/api/admin-panel', verifyToken, (req, res) => {
  res.json({ message: `Hoş geldin admin, kullanıcı ID: ${req.user.userId}` });
});



// Server başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
