const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  author: String // Will be changed with user model later.
});

module.exports = mongoose.model('Comment', commentSchema);
