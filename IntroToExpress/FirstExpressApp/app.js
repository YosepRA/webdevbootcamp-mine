var express = require('express');
var app = express();

// ROUTES
// "/" sends "Hi There!"
app.get('/', function(req, res) {
  res.send('Hi There!');
});

// "/bye" sends "GoodBye"
app.get('/bye', function(req, res) {
  res.send('Good Bye');
});

// "/dog" sends "WOOF!"
app.get('/dog', function(req, res) {
  res.send('WOOF!!');
});

app.get('/r/:subredditName', function(req, res) {
  let subredditName = req.params.subredditName;
  res.send('Welcome to ' + subredditName + ' subreddit.');
});

// "*" sends back "Route not available"
app.get('*', function(req, res) {
  res.send('Route not available');
});

// Tell Express to listen to requests (start server) to port 3000
app.listen(3000, function() {
  console.log('Server has started');
});
