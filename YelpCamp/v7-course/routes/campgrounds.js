const express = require('express'),
  router = express.Router(),
  Campground = require('../models/campground');

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
router.get('/new', (req, res) => {
  res.render('campgrounds/new');
});

// RESTful CREATE Route: Create and add new campground to DB.
router.post('/', (req, res) => {
  const newCamp = req.body.camp;

  Campground.create(newCamp, (err, camp) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

// RESTful SHOW Route: Show information about one campground.
router.get('/:id', (req, res) => {
  const id = req.params.id;

  Campground.findById(id)
    .populate('comments')
    .exec((err, camp) => {
      if (err) {
        console.log(err);
      } else {
        res.render('campgrounds/show', { camp: camp });
      }
    });
});

module.exports = router;
