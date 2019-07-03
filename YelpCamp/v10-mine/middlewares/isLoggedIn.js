// To check if there is a User in a session.
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error', 'Please login first.');
    res.redirect('/login');
  }
}

module.exports = isLoggedIn;
