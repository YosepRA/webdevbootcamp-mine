/* ========= SERVER SETUP ========= */

const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Campground = require('./models/campground'),
  Comment = require('./models/comment');
seedDB = require('./seeds');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('useNewUrlParser', true);
mongoose.connect('mongodb://localhost:27017/yelp_camp_v4');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error!'));
db.once('open', () => {
  console.log('Database has been connected successfully!');
});

// Seed whenever the server restarts. The purpose is to use starter data to check the functionality ~
// ~ and avoid cluttered data in the DB.
seedDB();

/* ========= ROUTES ========= */

// Adding notes to each route about RESTful routes.

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
      res.render('index', { campgrounds: campgrounds });
    }
  });
});

/* RESTful convention. 
  * Set the route to show a list of items to be the same as 
    the route to add a new item to the list.
    e.g: .get('/friends') & .post('/friends')
*/
// RESTful CREATE Route: Create and add new campground to DB.
app.post('/campgrounds', (req, res) => {
  // Get data from the form and add to campgrounds array.
  const newCamp = req.body.camp;

  Campground.create(newCamp, (err, camp) => {
    if (err) {
      console.log(err);
    } else {
      // Redirect back to campgrounds page.
      res.redirect('/campgrounds');
    }
  });
});

/* RESTful convention.
 * Set the route for new item form input to be "/item/new".
 */
// RESTful NEW Route: Show a form to add new campground.
app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

// RESTful SHOW Route: Show information about one campground.
// Side Note: This route has to be defined below the NEW route. ~
// ~ Or else '/campgrounds/new' will go to this route.
app.get('/campgrounds/:id', (req, res) => {
  // Find the campground with provided ID
  const id = req.params.id;

  // Using data reference.
  Campground.findById(id)
    .populate('comments')
    .exec((err, camp) => {
      if (err) {
        console.log(err);
      } else {
        res.render('show', { camp: camp });
      }
    });

  // Using data embedding
  /* Campground.findById(id, (err, camp) => {
    if (err) {
      console.log(err);
    } else {
      res.render('show', { camp: camp });
    }
  }); */
});

/* ========= NESTED COMMENTS ROUTES ========= */

// Comment NEW Route.
// To show form for adding new comment.
app.get('/campgrounds/:id/comments/new', (req, res) => {
  res.render('newComment', { id: req.params.id });
});

// Comment CREATE Route.
// To create new Comment AND associate it with its particular Campground.
app.post('/campgrounds/:id/comments', (req, res) => {
  const newComment = req.body.comment;
  const campgroundID = req.params.id;
  // Create new Comment.
  Comment.create(newComment, (err, comment) => {
    if (err) {
      console.log(err);
    } else {
      // Associate newly created Comment to particular Campground based on provided ID params.
      // Find Campground.
      Campground.findById(campgroundID, (err, campground) => {
        if (err) {
          console.log(err);
        } else {
          // Add new Comment to "comments" array inside found campground data.
          campground.comments.push(comment);
          // Save it.
          campground.save((err, campground) => {
            if (err) {
              console.log(err);
            } else {
              // console.log('Data association is successfull!', campground);
              res.redirect('/campgrounds/' + campgroundID);
            }
          });
        }
      });
    }
  });
});

app.listen(3000, () => {
  console.log('YelpCamp V4-Course Server has started!');
});
