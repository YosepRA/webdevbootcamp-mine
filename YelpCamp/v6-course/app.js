/* ========= SERVER SETUP ========= */

const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Campground = require('./models/campground'),
  Comment = require('./models/comment'),
  User = require('./models/user'),
  seedDB = require('./seeds'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  session = require('express-session');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'Campground is the best',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

// This will create a value that is available throughout all templates.
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

/* ========= PASSPORT SETUP ========= */

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* ========= DATABASE SETUP ========= */

mongoose.connect('mongodb://localhost:27017/yelp_camp_v6', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error!'));
db.once('open', () => {
  console.log('Database has been connected successfully!');
});

seedDB();

/* ========= ROUTES ========= */

app.get('/', (req, res) => {
  res.render('home');
});

// RESTful INDEX Route: Show list of all campgrounds.
app.get('/campgrounds', (req, res) => {
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
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

// RESTful CREATE Route: Create and add new campground to DB.
app.post('/campgrounds', (req, res) => {
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
app.get('/campgrounds/:id', (req, res) => {
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

/* ========= COMMENTS ROUTES ========= */

// Comment NEW Route.
// To show form for adding new comment.
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  const id = req.params.id;

  Campground.findById(id, (err, camp) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { camp: camp });
    }
  });
});

// Comment CREATE Route.
// To create new Comment AND associate it with its particular Campground.
app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
  const user = req.user;
  const text = req.body.text;
  const campgroundID = req.params.id;

  // Create new Comment.
  Comment.create({ text: text }, (err, comment) => {
    if (err) {
      console.log(err);
    } else {
      // Find User.
      User.findById(user._id, (err, user) => {
        if (err) {
          console.log(err);
        } else {
          // Associating User and Comment.
          // Add comment to User's comments array.
          user.comments.push(comment);
          user.save((err, user) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Comment has been added to User's comments array.");
            }
          });
          // Add User to comment's author property.
          comment.author = user;
          comment.save((err, comment) => {
            if (err) {
              console.log(err);
            } else {
              console.log("User has been added to Comment's author property.");
              // Associate modified Comment with Campground.
              Campground.findById(campgroundID, (err, campground) => {
                if (err) {
                  console.log(err);
                } else {
                  // Add new Comment to "comments" array inside found campground data.
                  campground.comments.push(comment);
                  campground.save((err, campground) => {
                    if (err) {
                      console.log(err);
                    } else {
                      res.redirect('/campgrounds/' + campgroundID);
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

/* ========= AUTH ROUTES ========= */

// Secret Page.
// This is just an experimental route to test the session. Delete or comment if unnecessary.
/* app.get('/secret', isLoggedIn, (req, res) => {
  res.render('secret');
}); */

// Register
// Show register form.
app.get('/register', (req, res) => {
  const info = new Object();
  res.render('register', { info: info });
});

// Handle User Registration.
app.post('/register', (req, res) => {
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

// Login
// Show login form.
app.get('/login', (req, res) => {
  const info = new Object();

  res.render('login', { info: info });
});

// Handle User Login
/* app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }),
  (req, res) => {
    // Leaving this blank for now.
  }
); */
app.post('/login', (req, res, next) => {
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
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

/* ========= MIDDLEWARE ========= */

function isLoggedIn(req, res, next) {
  const info = { message: 'Please login first' };

  if (req.isAuthenticated()) {
    return next();
  } else {
    res.render('login', { info: info });
  }
}

app.listen(3000, () => {
  console.log('YelpCamp V6-Course Server has started!');
});
