const express = require('express'),
  router = express.Router({ mergeParams: true }),
  Campground = require('../models/campground'),
  Comment = require('../models/comment'),
  isLoggedIn = require('../middlewares/isLoggedIn'),
  isCommentCreatedBy = require('../middlewares/isCommentCreatedBy');

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
      comment.author = user;
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
                  req.flash('success', 'Comments added.');
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

// Edit Route.
router.get('/:commentID/edit', isLoggedIn, isCommentCreatedBy, (req, res) => {
  const campgroundID = req.params.id;
  const commentID = req.params.commentID;

  Campground.findById(campgroundID, (err, camp) => {
    if (err) {
      console.log(err);
    } else {
      Comment.findById(commentID, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          res.render('comments/edit', { camp: camp, comment: comment });
        }
      });
    }
  });
});

// Update Route.
router.put('/:commentID', isLoggedIn, isCommentCreatedBy, (req, res) => {
  const campgroundID = req.params.id;
  const commentID = req.params.commentID;
  const updatedText = req.body.text;

  Comment.findByIdAndUpdate(commentID, { text: updatedText }, (err, comment) => {
    if (err) {
      console.log(err);
    } else {
      req.flash('success', 'Successfully updates comment.');
      res.redirect('/campgrounds/' + campgroundID);
    }
  });
});

// Destroy Route.
router.delete('/:commentID', isLoggedIn, isCommentCreatedBy, (req, res) => {
  const campgroundID = req.params.id;
  const commentID = req.params.commentID;

  Comment.findByIdAndDelete(commentID, err => {
    if (err) {
      console.log(err);
    } else {
      req.flash('success', 'Successfully deletes comment.');
      res.redirect('/campgrounds/' + campgroundID);
    }
  });
});

module.exports = router;
