const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

const commentSchema = new mongoose.Schema({
  text: String,
  author: UserSchema
});

module.exports = mongoose.model('Comment', commentSchema);
