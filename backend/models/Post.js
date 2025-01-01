const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: true },
  datePosted: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);
