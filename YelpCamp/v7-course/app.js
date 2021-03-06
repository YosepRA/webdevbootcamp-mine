/* ========= SERVER SETUP ========= */

const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  User = require('./models/user'),
  seedDB = require('./seeds'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  session = require('express-session');

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

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

/* ========= PASSPORT SETUP ========= */

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* ========= DATABASE SETUP ========= */

mongoose.connect('mongodb://localhost:27017/yelp_camp_v7', { useNewUrlParser: true });
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
  console.log('YelpCamp V7-Course Server has started!');
});
