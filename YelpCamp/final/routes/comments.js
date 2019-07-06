const express = require('express'),
  router = express.Router({ mergeParams: true }),
  Campground = require('../models/campground'),
  Comment = require('../models/comment'),
  middleware = require('../middlewares');

// NEW Route.
// To show form for adding new comment.
router.get('/new', middleware.isLoggedIn, (req, res) => {
  const campgroundID = req.params.id;

  Campground.findById(campgroundID, (err, camp) => {
    if (err) {
      req.flash('error', 'Something went wrong. Please try again later.');
      res.redirect('/campgrounds');
    } else {
      res.render('comments/new', { camp: camp });
    }
  });
});

// CREATE Route.
// To create new Comment AND associate it with its particular Campground.
router.post('/', middleware.isLoggedIn, (req, res) => {
  const user = req.user;
  const text = req.body.text;
  const campgroundID = req.params.id;

  // Create new Comment.
  Comment.create({ text: text }, (err, comment) => {
    if (err) {
      req.flash('error', 'Something went wrong. Please try again later.');
      res.redirect('/campgrounds');
    } else {
      // Store user's data inside newly created comment's author property.
      comment.author = user;
      comment.save((err, comment) => {
        if (err) {
          req.flash('error', 'Something went wrong. Please try again later.');
          res.redirect('/campgrounds');
        } else {
          // Store comment's ID inside Campground's comments array.
          Campground.findById(campgroundID, (err, camp) => {
            if (err) {
              req.flash('error', 'Something went wrong. Please try again later.');
              res.redirect('/campgrounds');
            } else {
              camp.comments.push(comment);
              camp.save((err, camp) => {
                if (err) {
                  req.flash('error', 'Something went wrong. Please try again later.');
                  res.redirect('/campgrounds');
                } else {
                  req.flash('success', 'Successfully creates comment.');
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

// EDIT ROUTE.
router.get('/:commentID/edit', middleware.isCommentCreatedBy, (req, res) => {
  const campgroundID = req.params.id;
  const commentID = req.params.commentID;

  Comment.findById(commentID, (err, comment) => {
    if (err) {
      req.flash('error', 'Something went wrong. Please try again later.');
      res.redirect('/campgrounds');
    } else {
      res.render('comments/edit', { campgroundID: campgroundID, comment: comment });
    }
  });
});

// UPDATE ROUTE.
router.put('/:commentID', middleware.isCommentCreatedBy, (req, res) => {
  const campgroundID = req.params.id;
  const commentID = req.params.commentID;
  const updatedData = req.body.text;

  Comment.findByIdAndUpdate(commentID, { text: updatedData }, (err, comment) => {
    if (err) {
      req.flash('error', 'Something went wrong. Please try again later.');
      res.redirect('/campgrounds');
    } else {
      req.flash('success', 'Successfully updates comment.');
      res.redirect('/campgrounds/' + campgroundID);
    }
  });
});

// DESTROY ROUTE.
router.delete('/:commentID', middleware.isCommentCreatedBy, (req, res) => {
  const campgroundID = req.params.id;
  const commentID = req.params.commentID;

  Comment.findByIdAndDelete(commentID, err => {
    if (err) {
      req.flash('error', 'Something went wrong. Please try again later.');
      res.redirect('/campgrounds');
    } else {
      req.flash('success', 'Successfully deletes comment.');
      res.redirect('/campgrounds/' + campgroundID);
    }
  });
});

module.exports = router;
