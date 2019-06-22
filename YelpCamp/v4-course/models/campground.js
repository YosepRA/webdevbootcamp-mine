const mongoose = require('mongoose');
// Schema is used for embedding instead of referencing data.
/* const commentSchema = mongoose.Schema({
  text: String,
  author: String
}); */

const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

module.exports = mongoose.model('Campground', campgroundSchema);
