/* ========== SERVER SETUP ========== */

const express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  expressSanitizer = require('express-sanitizer');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/Blog_App_Lecture', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error!'));
db.once('open', () => {
  console.log('Database has connected succesfully!');
});

const blogSchema = mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});

const Blog = mongoose.model('Blog', blogSchema);

/* ========== ROUTES ========== */

// ROOT
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

// INDEX ROUTE
app.get('/blogs', (req, res) => {
  // Retrieve all blogs from DB.
  Blog.find((err, blogs) => {
    if (err) {
      console.log('Error in retrieving data.');
    } else {
      res.render('index', { blogs: blogs });
    }
  });
});

// NEW ROUTE
app.get('/blogs/new', (req, res) => {
  res.render('new');
});

// CREATE ROUTE
app.post('/blogs', (req, res) => {
  // Get data from the form.
  const blogData = req.body.blog;
  // Sanitize the form body.
  blogData.body = req.sanitize(blogData.body);
  // Store to DB.
  Blog.create(blogData, (err, blog) => {
    if (err) {
      console.log('Error: failed to store data to DB.');
      res.send('Error: failed to store data to DB.');
    } else {
      // Redirect to '/blogs'.
      res.redirect('/blogs');
    }
  });
});

// SHOW ROUTE
app.get('/blogs/:id', (req, res) => {
  // Get ID
  const id = req.params.id;
  // Find data with provided ID
  Blog.findById(id, (err, blog) => {
    if (err) {
      res.send('Failed to retrieve blog.');
    } else {
      // Render Show Template
      res.render('show', { blog: blog });
    }
  });
});

// EDIT ROUTE
app.get('/blogs/:id/edit', (req, res) => {
  // Get ID.
  const id = req.params.id;
  // Find data from DB.
  Blog.findById(id, (err, blog) => {
    if (err) {
      res.send(err);
    } else {
      // Render edit form.
      res.render('edit', { blog: blog });
    }
  });
});

// UPDATE ROUTE
app.put('/blogs/:id', (req, res) => {
  // Get ID and form data.
  const id = req.params.id,
    blogData = req.body.blog;
  // Sanitize the form body.
  blogData.body = req.sanitize(blogData.body);
  // Find and Update data from DB.
  Blog.findByIdAndUpdate(id, blogData, (err, blog) => {
    if (err) {
      res.send('Error: Cannot update data.', err);
    } else {
      // Redirect to SHOW route.
      res.redirect('/blogs/' + id);
    }
  });
});

// DESTROY ROUTE
app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndDelete(id, err => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs');
    }
  });
});

app.listen(3000, () => {
  console.log('Blog App - Lecture Server has started!');
});
