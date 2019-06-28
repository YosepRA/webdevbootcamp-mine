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
      // Store user's data inside newly created comment's author property.
      comment.author.id = user._id;
      comment.author.username = user.username;
      comment.save((err, comment) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Added User to Comment's author property.");
          // Store comment's ID inside Campground's comments array.
          Campground.findById(campgroundID, (err, camp) => {
            if (err) {
              console.log(err);
            } else {
              camp.comments.push(comment);
              camp.save((err, camp) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Added Comment to Campground's comments array.");
                  res.redirect('/campgrounds/' + campgroundID);
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
