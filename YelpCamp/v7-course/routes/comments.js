const express = require('express'),
  router = express.Router({ mergeParams: true }),
  Campground = require('../models/campground'),
  Comment = require('../models/comment'),
  User = require('../models/user');

// Comment NEW Route.
// To show form for adding new comment.
router.get('/new', isLoggedIn, (req, res) => {
  const id = req.params.id;

  Campground.findById(id, (err, camp) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { camp: camp });
    }
  });
});

// Comment CREATE Route.
// To create new Comment AND associate it with its particular Campground.
router.post('/', isLoggedIn, (req, res) => {
  const user = req.user;
  const text = req.body.text;
  const campgroundID = req.params.id;

  // Create new Comment.
  Comment.create({ text: text }, (err, comment) => {
    if (err) {
      console.log(err);
    } else {
      // Find User.
      User.findById(user._id, (err, user) => {
        if (err) {
          console.log(err);
        } else {
          // Associating User and Comment.
          // Add comment to User's comments array.
          user.comments.push(comment);
          user.save((err, user) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Comment has been added to User's comments array.");
            }
          });
          // Add User to comment's author property.
          comment.author = user;
          comment.save((err, comment) => {
            if (err) {
              console.log(err);
            } else {
              console.log("User has been added to Comment's author property.");
              // Associate modified Comment with Campground.
              Campground.findById(campgroundID, (err, campground) => {
                if (err) {
                  console.log(err);
                } else {
                  // Add new Comment to "comments" array inside found campground data.
                  campground.comments.push(comment);
                  campground.save((err, campground) => {
                    if (err) {
                      console.log(err);
                    } else {
                      res.redirect('/campgrounds/' + campgroundID);
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

/* ========= MIDDLEWARE ========= */

function isLoggedIn(req, res, next) {
  const info = { message: 'Please login first' };

  if (req.isAuthenticated()) {
    return next();
  } else {
    res.render('login', { info: info });
  }
}

module.exports = router;
