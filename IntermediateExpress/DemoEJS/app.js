/* ========== SERVER SETUP ========== */

var express = require('express');
var app = express();

app.use(express.static('public')); // Tell Express to also serve public directory. Purpose is to look up for public assets such as stylesheets and scripts.
app.set('view engine', 'ejs'); // To set the default engine to ejs, so there is no need to define extension to call a template.

/* ========== ROUTES ========== */

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/fallinlovewith/:thing', function(req, res) {
  let thing = req.params.thing;
  // let text = thing.charAt(0).toUpperCase() + thing.slice(1);

  res.render('love', { thing: thing });
});

app.get('/posts', function(req, res) {
  let posts = [
    {
      title: 'Content 1',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Proin vulputate eros fringilla leo faucibus placerat.Nunc eget massa suscipit, venenatis nisi eu, luctus diam.Nulla tincidunt, tellus sed faucibus viverra.'
    },
    {
      title: 'Content 2',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Proin vulputate eros fringilla leo faucibus placerat.Nunc eget massa suscipit, venenatis nisi eu, luctus diam.Nulla tincidunt, tellus sed faucibus viverra.'
    },
    {
      title: 'Content 3',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Proin vulputate eros fringilla leo faucibus placerat.Nunc eget massa suscipit, venenatis nisi eu, luctus diam.Nulla tincidunt, tellus sed faucibus viverra.'
    }
  ];

  res.render('posts', { postsArr: posts });
});

app.get('*', function(req, res) {
  res.render('notFound');
});

app.listen(3000, function() {
  console.log('DemoEJS Server has started!');
});
