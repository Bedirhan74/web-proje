// models/Visitor.js
const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip: String,
  lastActive: Date
}, { timestamps: true }); // <-- burası önemli

module.exports = mongoose.model('Visitor', visitorSchema);
