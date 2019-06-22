/* ========= SERVER SETUP ========= */

const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('useNewUrlParser', true);
mongoose.connect('mongodb://localhost:27017/yelp_camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error!'));
db.once('open', () => {
  console.log('Database has been connected successfully!');
});

/* ========= SCHEMA ========= */

const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

const Campground = mongoose.model('Campground', campgroundSchema);

/* ========= STARTER DATA ========= */
// Delete or comment if not used.
/* Campground.create({
  name: 'Spark Sets',
  image:
    'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  description:
    "Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crow's nest nipperkin grog yardarm hempen halter furl.Swab barque interloper chantey doubloon starboard grog black jack gangway rutters."
}); */

/* ========= FUNCTIONS ========= */

function Camp(name, image, description) {
  this.name = name;
  this.image = image;
  this.description = description;
}

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
  const campName = req.body.campName;
  const imageURL = req.body.imageURL;
  const description = req.body.description;
  const newCamp = new Camp(campName, imageURL, description);

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

  Campground.findById(id, (err, camp) => {
    if (err) {
      console.log(err);
    } else {
      // Render show template
      res.render('show', { camp: camp });
    }
  });
});

app.listen(3000, () => {
  console.log('YelpCamp V2-Lecture Server has started!');
});
