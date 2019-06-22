/* ========== SERVER SETUP ========== */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

var friends = ['Michael', 'Lizzy', 'Lee'];

/* ========== ROUTES ========== */

app.get('/', function(req, res) {
  res.render('home');
});

// friends
app.get('/friends', function(req, res) {
  res.render('friends', { friends: friends });
});

// addFriend
app.post('/addFriend', function(req, res) {
  let friendName = req.body.friendName;

  friends.push(friendName);
  res.redirect('/friends');
});

app.listen(3000, function() {
  console.log('POST Request Demo Server has started!');
});
