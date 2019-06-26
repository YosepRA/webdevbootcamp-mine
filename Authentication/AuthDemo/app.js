/* ========== SERVER SETUP ========== */

const express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  User = require('./models/user'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  passportLocalMongoose = require('passport-local-mongoose'),
  session = require('express-session');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
// "express-session" has to be set up before intializing "passport.session()".
// Otherwise, there will be no user session inside the http request.
// And thus, "req.isAuthenticated()" will always return false.
app.use(
  session({
    secret: 'This is super secret',
    resave: false,
    saveUninitialized: false
  })
);
// Initialize passport on Express.
app.use(passport.initialize());
app.use(passport.session());

// All of User's methods below comes from passport-local-mongoose plugin.
// So we don't explicitly define it ourself in either passport or UserSchema.
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // To encode.
passport.deserializeUser(User.deserializeUser()); // To decode.

mongoose.connect('mongodb://localhost:27017/auth_demo', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection failed!'));
db.once('open', () => {
  console.log('Database has connected successfully!');
});

/* ========== ROUTES ========== */

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/secret', isLoggedIn, (req, res) => {
  res.render('secret');
});

/* ========== AUTH ROUTES ========== */

// Show register form.
app.get('/register', (req, res) => {
  res.render('register');
});

// Handle registration form.
app.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // passport-local-mongoose plugin.
  // Create new user, hash the password, and save to DB.
  User.register(new User({ username: username }), password, (err, user) => {
    if (err) {
      console.log(err);
      res.redirect('/register');
    } else {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/secret');
      });
    }
  });
});

// Show login form.
app.get('/login', (req, res) => {
  res.render('login');
});

// Handle Login authentication.
// Middleware: It runs right after the route is called and before the final callback.
// Middleware in this route's case is "passport.authenticate()". You can add as many middlewares ~
// ~ as needed.
app.post(
  '/login',
  // This method will do the job of authenticating user data.
  passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
  }),
  (req, res) => {}
); // Leaving the callback for now.

// Logout route.
app.get('/logout', (req, res) => {
  req.logout(); // This will destroy all user's data in the session.
  res.redirect('/');
  // res.send('You hit the logout route!');
});

/* ========== MIDDLEWARE ========== */

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

app.listen(3000, () => {
  console.log('AuthDemo Server has started!');
});
