// This file will contain routes that isn't related to any particular models.

const express = require('express'),
  router = express.Router(),
  User = require('../models/user'),
  passport = require('passport');

// Root
router.get('/', (req, res) => {
  res.render('home');
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
      console.log(err);
      req.flash('error', err.message); // Set the value of flash key "error".
      res.redirect('/register'); // "res.locals.error" will have a value of [ err.message ].
    } else {
      passport.authenticate('local')(req, res, () => {
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
    successFlash: 'Welcome!', // key: success
    failureFlash: 'Username or password is incorrect.' // key: error
  }),
  (req, res) => {
    // Leaving this blank for now.
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
