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
  const info = new Object();
  res.render('register', { info: info });
});

// Handle User Registration.
router.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const newUser = new User({ username: username });

  User.register(newUser, password, (err, user) => {
    if (err) {
      console.log(err);
      res.render('register', { info: err }); // It will provide feedback if there's an error.
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
  const info = new Object();
  res.render('login', { info: info });
});

// Handle User Login
/* router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }),
  (req, res) => {
    // Leaving this blank for now.
  }
); */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render('login', { info: info });
    }
    req.login(user, err => {
      if (err) {
        return next(err);
      }
      return res.redirect('/campgrounds');
    });
  })(req, res, () => {
    // Leaving this blank for now.
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
