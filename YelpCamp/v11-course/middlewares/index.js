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
          console.log(err);
        } else {
          // Authorize.
          if (camp.author._id.equals(user._id)) {
            next();
          } else {
            req.flash('error', 'You are not allowed to do that!');
            res.redirect('back');
          }
        }
      });
    } else {
      req.flash('error', 'Please login first!');
      res.redirect('back');
    }
  },
  isCommentCreatedBy: function(req, res, next) {
    const user = req.user;
    const commentID = req.params.commentID;

    if (req.isAuthenticated()) {
      // Find commnent.
      Comment.findById(commentID, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          // Authorize.
          if (comment.author._id.equals(user._id)) {
            next();
          } else {
            req.flash('error', 'You are not allowed to do that!');
            res.redirect('back');
          }
        }
      });
    } else {
      req.flash('error', 'Please login first!');
      res.redirect('back');
    }
  }
};

module.exports = middleware;
