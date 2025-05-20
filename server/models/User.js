const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashlenecek
  role: { type: String, default: 'admin' } // sadece admin olacak
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);