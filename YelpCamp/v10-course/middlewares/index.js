const Campground = require('../models/campground'),
  Comment = require('../models/comment');

let middleware = {
  isLoggedIn: function(req, res, next) {
    const info = { message: 'Please login first' };

    if (req.isAuthenticated()) {
      return next();
    } else {
      res.render('login', { info: info });
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
            res.redirect('back');
          }
        }
      });
    } else {
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
            res.redirect('back');
          }
        }
      });
    } else {
      res.redirect('back');
    }
  }
};

module.exports = middleware;
