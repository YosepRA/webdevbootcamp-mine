const express = require('express'),
  router = express.Router(),
  User = require('../models/user'),
  passport = require('passport');

// Root
router.get('/', (req, res) => {
  res.render('landing');
});

// Register Routes
// Show register form.
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle User Registration.
router.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const newUser = new User({ username: username });

  User.register(newUser, password, (err, user) => {
    if (err) {
      req.flash('error', err.message);
      res.redirect('/register');
    } else {
      passport.authenticate('local')(req, res, () => {
        req.flash('success', 'Welcome!');
        res.redirect('/campgrounds');
      });
    }
  });
});

// Login Routes
// Show login form.
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle User Login
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
    successFlash: 'Welcome',
    failureFlash: true
  })
);

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Successfully Logged Out.');
  res.redirect('/campgrounds');
});

module.exports = router;
