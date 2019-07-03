const express = require('express'),
  router = express.Router(),
  Campground = require('../models/campground'),
  isLoggedIn = require('../middlewares/isLoggedIn'),
  isCreatedBy = require('../middlewares/isCreatedBy');

// RESTful INDEX Route: Show list of all campgrounds.
router.get('/', (req, res) => {
  // Retrieve campground data from DB.
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds: campgrounds });
    }
  });
});

// RESTful NEW Route: Show a form to add new campground.
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// RESTful CREATE Route: Create and add new campground to DB.
router.post('/', isLoggedIn, (req, res) => {
  const user = req.user;
  const newCamp = req.body.camp;
  newCamp.author = {
    _id: user._id,
    username: user.username
  };

  Campground.create(newCamp, (err, camp) => {
    if (err) {
      console.log(err);
    } else {
      req.flash('success', 'Successfully adds campground.');
      res.redirect('/campgrounds');
    }
  });
});

// RESTful SHOW Route: Show information about one campground.
router.get('/:id', (req, res) => {
  const campgroundID = req.params.id;

  Campground.findById(campgroundID)
    .populate('comments')
    .exec((err, camp) => {
      if (err) {
        console.log(err);
      } else {
        res.render('campgrounds/show', { camp: camp });
      }
    });
});

// Edit Route.
router.get('/:id/edit', isLoggedIn, isCreatedBy, (req, res) => {
  const campgroundID = req.params.id;

  Campground.findById(campgroundID, (err, camp) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/edit', { camp: camp });
    }
  });
});

// Update Route.
router.put('/:id', isLoggedIn, isCreatedBy, (req, res) => {
  const campgroundID = req.params.id;
  const updatedData = req.body.camp;

  Campground.findByIdAndUpdate(campgroundID, updatedData, (err, camp) => {
    if (err) {
      console.log(err);
    } else {
      req.flash('success', 'Successfully updates campground.');
      res.redirect('/campgrounds/' + campgroundID);
    }
  });
});

// Destroy Route.
router.delete('/:id', isLoggedIn, isCreatedBy, (req, res) => {
  const campgroundID = req.params.id;

  Campground.findByIdAndDelete(campgroundID, err => {
    if (err) {
      console.log(err);
    } else {
      req.flash('warning', 'Successfully deletes campground.');
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
