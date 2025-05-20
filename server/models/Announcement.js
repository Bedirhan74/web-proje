const mongoose = require('mongoose');
const slugify = require('slugify');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String, unique: true }
}, { timestamps: true });

// Slug oluştur
announcementSchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Announcement', announcementSchema);
