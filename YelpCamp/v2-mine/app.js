/* ========= SERVER SETUP ========= */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

/* ========= DATABASE SETUP ========= */

mongoose.set('useNewUrlParser', true);
mongoose.connect('mongodb://localhost/yelpcamp_mine');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('Database has been connected!');
});

const campSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

const Camp = mongoose.model('Camp', campSchema);

/* ========= STARTER DATA ========= */

/* Camp.create(
  {
    name: 'Grand Oak',
    image:
      'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec feugiat vehicula metus in commodo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur non purus hendrerit, blandit erat non, ornare diam. Etiam sodales semper neque, ac scelerisque lorem luctus gravida. Curabitur elementum nisi ut dolor.'
  },
  (err, camp) => {
    if (err) {
      console.log(err);
    } else {
      console.log('New Campground has been added to the DB');
    }
  }
); */

/* ========= FUNCTIONS ========= */

function Campground(name, image, description) {
  this.name = name;
  this.image = image;
  this.description = description;
}

function CampData(camps, status) {
  this.camps = camps;
  this.status = status;
}

/* ========= ROUTES ========= */

app.get('/', (req, res) => {
  res.render('home');
});

// INDEX Route.
app.get('/campgrounds', (req, res) => {
  // Retrieve data from DB.
  Camp.find((err, camps) => {
    if (err) {
      console.log(err);
    } else {
      let campData = err ? new CampData(null, 'false') : new CampData(camps, 'true');
      res.render('index', { campData: campData });
    }
  });
});

/* RESTful convention. 
  * Set the route to show a list of items to be the same as 
    the route to add a new item to the list.
    e.g: .get('/friends') & .post('/friends')
*/
// CREATE Route.
app.post('/campgrounds', (req, res) => {
  // Get data from the form and add to campgrounds array.
  const campName = req.body.campName;
  const imageURL = req.body.imageURL;
  const description = req.body.description;
  const newCamp = new Campground(campName, imageURL, description);

  // Storing new data to DB.
  Camp.create(newCamp, (err, camp) => {
    if (err) {
      console.log('Something wrong in post /campgrounds');
    } else {
      // Redirect back to campgrounds page.
      res.redirect('/campgrounds');
    }
  });
});

/* RESTful convention.
 * Set the route for new item form input to be "/item/new".
 */
// NEW Route.
app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

// SHOW Route.
app.get('/campgrounds/:id', (req, res) => {
  // Get the ID from params.
  let id = req.params.id;

  // Find data from DB based on ID
  /* Camp.find({ _id: id }, (err, camp) => {
    if (err) {
      console.log(err);
    } else {
      // Render show template and provide it with campground data.
      res.render('show', { camp: camp });
    }
  }); */

  // Find Data using .findById()
  Camp.findById(id, (err, camp) => {
    if (err) {
      console.log(err);
    } else {
      // Render show template and provide it with campground data.
      res.render('show', { camp: camp });
    }
  });
});

app.listen(3000, () => {
  console.log('YelpCamp V2-Mine Server has started!');
});
