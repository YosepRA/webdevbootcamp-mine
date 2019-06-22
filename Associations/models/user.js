const mongoose = require('mongoose');
// USER
// Updating the Schema (posts) to support Data Association Referencing.
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
