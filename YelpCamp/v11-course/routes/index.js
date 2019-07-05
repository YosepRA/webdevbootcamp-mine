// This file will contain routes that isn't related to any particular models.

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
      console.log(err);
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
  }),
  (req, res) => {
    // Leaving this blank for now.
  }
);
/* router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error', info.message);
      return res.redirect('/login');
    }
    req.login(user, err => {
      if (err) {
        return next(err);
      }
      req.flash('success', 'Welcome!');
      return res.redirect('/campgrounds');
    });
  })(req, res, () => {
    // Leaving this blank for now.
  });
}); */

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Successfully Logged Out.');
  res.redirect('/campgrounds');
});

module.exports = router;
