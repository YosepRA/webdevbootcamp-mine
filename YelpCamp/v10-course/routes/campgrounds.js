const express = require('express'),
  router = express.Router(),
  Campground = require('../models/campground'),
  Comment = require('../models/comment'),
  middleware = require('../middlewares');

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
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// RESTful CREATE Route: Create and add new campground to DB.
router.post('/', middleware.isLoggedIn, (req, res) => {
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

// EDIT Route.
router.get('/:id/edit', middleware.isCampgroundCreatedBy, (req, res) => {
  const campgroundID = req.params.id;

  Campground.findById(campgroundID, (err, camp) => {
    if (err) {
      console.log(err);
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
      console.log(err);
    } else {
      res.redirect('/campgrounds/' + campgroundID);
    }
  });
});

// DESTROY Route.
router.delete('/:id', middleware.isCampgroundCreatedBy, (req, res) => {
  const campgroundID = req.params.id;

  Campground.findById(campgroundID, (err, camp) => {
    if (err) {
      console.log(err);
    } else {
      // Delete all comments from Campground's comments array.
      camp.comments.forEach(commentID => {
        Comment.findByIdAndDelete(commentID, (err, comment) => {
          if (err) {
            console.log(err);
          } else {
            console.log(comment);
            console.log('Deleted comment.');
          }
        });
      });

      // Once all comments have been deleted, delete the campground.
      camp.remove(err => {
        if (err) {
          console.log(err);
        } else {
          console.log('Campground has been deleted!');
          res.redirect('/campgrounds');
        }
      });
    }
  });

  /* Campground.findByIdAndDelete(campgroundID, err => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  }); */
});

module.exports = router;
