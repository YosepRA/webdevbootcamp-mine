const Campground = require('../models/campground'),
  Comment = require('../models/comment');

let middleware = {
  isLoggedIn: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash('error', 'Please login first!');
      res.redirect('/login');
    }
  },
  isCampgroundCreatedBy: function(req, res, next) {
    const user = req.user;
    const campgroundID = req.params.id;

    if (req.isAuthenticated()) {
      // Find campground.
      Campground.findById(campgroundID, (err, camp) => {
        if (err) {
          req.flash('error', 'Something went wrong. Please try again later.');
          req.redirect('/campgrounds');
        } else {
          // Authorize.
          if (camp.author._id.equals(user._id)) {
            next();
          } else {
            req.flash('error', 'You are not allowed to do that!');
            res.redirect('/campgrounds');
          }
        }
      });
    } else {
      req.flash('error', 'Please login first!');
      res.redirect('/login');
    }
  },
  isCommentCreatedBy: function(req, res, next) {
    const user = req.user;
    const commentID = req.params.commentID;

    if (req.isAuthenticated()) {
      // Find commnent.
      Comment.findById(commentID, (err, comment) => {
        if (err) {
          req.flash('error', 'Something went wrong. Please try again later.');
          req.redirect('/campgrounds');
        } else {
          // Authorize.
          if (comment.author._id.equals(user._id)) {
            next();
          } else {
            req.flash('error', 'You are not allowed to do that!');
            res.redirect('/campgrounds');
          }
        }
      });
    } else {
      req.flash('error', 'Please login first!');
      res.redirect('/login');
    }
  }
};

module.exports = middleware;
