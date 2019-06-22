/* ========== SERVER SETUP ========== */

const express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

/* ========== DATABASE SETUP ========== */

mongoose.set('useNewUrlParser', true);
mongoose.connect('mongodb://localhost:27017/Blog_App_Mine');

const db = mongoose.connection;
db.on('error', console.error.bind('Database connection error!'));
db.once('open', () => {
  console.log('Database has been sucessfully connected!');
});

/* ========== ROUTES ========== */

// LANDING PAGE
app.get('/', (req, res) => {
  res.render('home');
});

// INDEX ROUTE
// Show all blogs.
app.get('/blogs', (req, res) => {
  res.render('index');
});

// NEW ROUTE
// Show form to create new blog.
app.get('/blogs/new', (req, res) => {
  res.render('new');
});

// CREATE ROUTE
// Receive new blog post data from NEW route and add to DB, then redirect somewhere.
app.post('/blogs', (req, res) => {
  res.send('You hit the POST route for adding new blog post.');
});

// SHOW ROUTE
// Show more informations about one blog.
app.get('/blogs/:id', (req, res) => {
  res.render('show');
});

// EDIT ROUTE
// Show form to edit one blog.
app.get('/blogs/:id/edit', (req, res) => {
  res.render('edit');
});

// UPDATE ROUTE
// Receive edited blog post and update the existing data in the DB, then redirect somewhere.
app.put('/blogs/:id', (req, res) => {
  res.send('You hit the PUT route for updating particular blog post.');
});

// DESTROY ROUTE
// Delete particular blog from DB, then redirect somewhere.
app.delete('/blogs/:id', (req, res) => {
  res.send('You hit the DESTROY route for deleting particular blog post.');
});

app.listen(3000, () => {
  console.log('Blog App - Mine Server has started!');
});
