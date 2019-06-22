const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/association_demo_2', { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error!'));
db.once('open', () => {
  console.log('Database has connected successfully!');
});

const Post = require('./models/post.js');
const User = require('./models/user.js');

// Create New User
/* let newUser = new User({
  name: 'Seamus Finnigan',
  email: 'seamus@boom.co.uk'
});

newUser.save((err, user) => {
  if (err) {
    console.log(err);
  } else {
    console.log(typeof user);
  }
}); */

// Create non associated new Post.
/* Post.create(
  {
    title: 'The most exciting place to visit.',
    content: 'Hogsmeade are there for those who are looking for fun.'
  },
  (err, post) => {
    if (err) {
      console.log(err);
    } else {
      console.log(post);
    }
  }
); */

// Create new post and associate it with user 'Seamus Finnigan'.
/* Post.create(
  {
    title: 'What did he do when Harry boasted about Voldemort?',
    content: 'Just like any other students, he mocks Harry by telling him that he is a liar.'
  },
  (err, post) => {
    if (err) {
      console.log(err);
    } else {
      // Find Seamus user data from DB.
      User.findOne({ name: 'Seamus Finnigan' }, (err, user) => {
        if (err) {
          console.log(err);
        } else {
          // Add newly created post into Seamus' posts array data.
          user.posts.push(post);
          // Save it. DON'T FORGET TO SAVE THE UPDATED DATA!!
          user.save((err, user) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Added new post to user's posts array.", user);
            }
          });
        }
      });
    }
  }
); */

// Retrieve 'Seamus' user data then console.log all of its content.
// But, rather than displaying user's posts array to be an array of ID, ~
// ~ instead we FILL IN posts array with an actual post data coming from ~
// ~ post collection based on its respective IDs.
User.findOne({ name: 'Seamus Finnigan' })
  .populate('posts')
  .exec((err, user) => {
    if (err) {
      console.log(err);
    } else {
      console.log(user);
    }
  });
