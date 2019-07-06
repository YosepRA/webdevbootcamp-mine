const express = require('express'),
  router = express.Router(),
  Campground = require('../models/campground'),
  Comment = require('../models/comment'),
  middleware = require('../middlewares');

// INDEX Route: Show list of all campgrounds.
router.get('/', (req, res) => {
  // Retrieve campground data from DB.
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      req.flash('error', 'Something went wrong. Please try again later.');
      res.redirect('/');
    } else {
      res.render('campgrounds/index', { campgrounds: campgrounds });
    }
  });
});

// NEW Route: Show a form to add new campground.
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// CREATE Route: Create and add new campground to DB.
router.post('/', middleware.isLoggedIn, (req, res) => {
  const user = req.user;
  const newCamp = req.body.camp;
  newCamp.author = {
    _id: user._id,
    username: user.username
  };

  Campground.create(newCamp, (err, camp) => {
    if (err) {
      req.flash('error', 'Something went wrong. Please try again later.');
      res.redirect('/campgrounds');
    } else {
      req.flash('success', 'Successfully creates campground.');
      res.redirect('/campgrounds');
    }
  });
});

// SHOW Route: Show information about one campground.
router.get('/:id', (req, res) => {
  const campgroundID = req.params.id;

  Campground.findById(campgroundID)
    .populate('comments')
    .exec((err, camp) => {
      if (err) {
        req.flash('error', 'Something went wrong. Please try again later.');
        res.redirect('/campgrounds');
      } else {
        res.render('campgrounds/show', { camp: camp });
      }
    });
});

// EDIT Route.
router.get('/:id/edit', middleware.isCampgroundCreatedBy, (req, res) => {
  const campgroundID = req.params.id;

  Campground.findById(campgroundID, (err, camp) => {
    if (err) {
      req.flash('error', 'Something went wrong. Please try again later.');
      res.redirect('/campgrounds');
    } else {
      res.render('campgrounds/edit', { camp: camp });
    }
  });
});

// UPDATE Route.
router.put('/:id', middleware.isCampgroundCreatedBy, (req, res) => {
  const campgroundID = req.params.id;
  const updatedData = req.body.camp;

  Campground.findByIdAndUpdate(campgroundID, updatedData, (err, camp) => {
    if (err) {
      req.flash('error', 'Something went wrong. Please try again later.');
      res.redirect('/campgrounds');
    } else {
      req.flash('success', 'Successfully updates campground.');
      res.redirect('/campgrounds/' + campgroundID);
    }
  });
});

// DESTROY Route.
router.delete('/:id', middleware.isCampgroundCreatedBy, (req, res) => {
  const campgroundID = req.params.id;

  Campground.findById(campgroundID, (err, camp) => {
    if (err) {
      req.flash('error', 'Something went wrong. Please try again later.');
      res.redirect('/campgrounds');
    } else {
      // Delete all comments from Campground's comments array.
      camp.comments.forEach(commentID => {
        Comment.findByIdAndDelete(commentID, err => {
          if (err) {
            req.flash('error', 'Something went wrong. Please try again later.');
            res.redirect('/campgrounds');
          }
        });
      });

      // Once all comments have been deleted, delete the campground.
      camp.remove(err => {
        if (err) {
          req.flash('error', 'Something went wrong. Please try again later.');
          res.redirect('/campgrounds');
        } else {
          req.flash('success', 'Successfully deletes campground.');
          res.redirect('/campgrounds');
        }
      });
    }
  });
});

module.exports = router;
