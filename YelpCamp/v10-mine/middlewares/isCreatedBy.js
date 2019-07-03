const Campground = require('../models/campground');

// To check if logged in User is the same with the Campground's author.
function isCreatedBy(req, res, next) {
  const user = req.user;
  const campgroundID = req.params.id;

  Campground.findById(campgroundID, (err, camp) => {
    if (err) {
      console.log(err);
    } else {
      if (user.username === camp.author.username) {
        return next();
      } else {
        res.redirect('/campgrounds');
      }
    }
  });
}

module.exports = isCreatedBy;
