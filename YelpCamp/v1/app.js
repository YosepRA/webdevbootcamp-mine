/* ========= SERVER SETUP ========= */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

let campgrounds = [
  {
    name: 'Salmon Creek',
    image:
      'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
  },
  {
    name: 'Mountain Hill',
    image:
      'https://images.pexels.com/photos/1309584/pexels-photo-1309584.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
  },
  {
    name: 'Cripple Canyon',
    image:
      'https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
  },
  {
    name: 'Salmon Creek',
    image:
      'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
  },
  {
    name: 'Mountain Hill',
    image:
      'https://images.pexels.com/photos/1309584/pexels-photo-1309584.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
  },
  {
    name: 'Cripple Canyon',
    image:
      'https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
  }
];

/* ========= FUNCTIONS ========= */

function Camp(name, image) {
  this.name = name;
  this.image = image;
}

/* ========= ROUTES ========= */

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', { campgrounds: campgrounds });
});

/* RESTful convention. 
  * Set the route to show a list of items to be the same as 
    the route to add a new item to the list.
    e.g: .get('/friends') & .post('/friends')
*/
app.post('/campgrounds', (req, res) => {
  // Get data from the form and add to campgrounds array.
  const campName = req.body.campName;
  const imageURL = req.body.imageURL;
  const newCamp = new Camp(campName, imageURL);

  campgrounds.push(newCamp);

  // Redirect back to campgrounds page.
  res.redirect('/campgrounds');
});

/* RESTful convention.
 * Set the route for new item form input to be "/item/new".
 */
app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

app.listen(3000, () => {
  console.log('YelpCamp V1 Server has started!');
});
