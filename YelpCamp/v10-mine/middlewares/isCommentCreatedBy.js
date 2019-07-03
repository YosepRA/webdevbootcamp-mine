const Comment = require('../models/comment');

function isCommentCreatedBy(req, res, next) {
  const user = req.user;
  const commentID = req.params.commentID;

  Comment.findById(commentID, (err, comment) => {
    if (err) {
      console.log(err);
    } else {
      if (user.username === comment.author.username) {
        return next();
      } else {
        res.redirect('/campgrounds');
      }
    }
  });
}

module.exports = isCommentCreatedBy;
