const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/association_demo', { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error!'));
db.once('open', () => {
  console.log('Database has connected successfully!');
});

// POST
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model('Post', postSchema);

// USER
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  posts: [postSchema]
});

const User = mongoose.model('User', userSchema);

// Creating and saving new User Data
/* let newUser = new User({
  name: 'Ronald',
  email: 'ronald@weasley.co.uk'
});

newUser.posts.push({
  title: 'What scares me the most?',
  content: 'Aragog!! But especially all kind of spiders.'
});

newUser.save((err, user) => {
  if (err) {
    console.log(err);
  } else {
    console.log(user);
  }
}); */

// Creating new Post
/* let newPost = new Post({
  title: "What's make a cute dog?",
  content: "It's the eye boy"
});

newPost.save((err, post) => {
  if (err) {
    console.log(err);
  } else {
    console.log(post);
  }
}); */

// Find user data and add new data into it.
/* User.findOne({ name: 'Ronald' }, (err, user) => {
  if (err) {
    console.log('Error when finding user.');
  } else {
    // Using the data coming back, add new post to its posts array.
    user.posts.push({
      title: 'The most traumatizing moment',
      content: 'Trying to bewitch Malfoy to eat slugs.'
    });
    // Save new data back to DB.
    user.save((err, user) => {
      if (err) {
        console.log('Error when saving new post!');
      } else {
        console.log(user);
      }
    });
  }
}); */
