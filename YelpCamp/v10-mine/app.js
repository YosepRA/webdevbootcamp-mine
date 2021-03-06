/* ========= SERVER SETUP ========= */

const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  session = require('express-session'),
  methodOverride = require('method-override'),
  flash = require('connect-flash'),
  seedDB = require('./seeds');

const User = require('./models/user');

const campgroundRoutes = require('./routes/campgrounds'),
  commentRoutes = require('./routes/comments'),
  indexRoutes = require('./routes/index');

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
app.use(methodOverride('_method'));
app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.user || {};
  res.locals.success = { message: req.flash('success') };
  res.locals.error = { message: req.flash('error') };
  res.locals.warning = { message: req.flash('warning') };
  next();
});

/* ========= PASSPORT SETUP ========= */

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* ========= DATABASE SETUP ========= */

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/yelp_camp_v10', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error!'));
db.once('open', () => {
  console.log('Database has been connected successfully!');
});

seedDB();

// Requiring Routes.
app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(3000, () => {
  console.log('YelpCamp V10-Mine Server has started!');
});
