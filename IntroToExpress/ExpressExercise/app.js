/* ===== SERVER SETUP === */
var express = require('express'),
  app = express();

/* ===== ROUTES === */
app.get('/', function(req, res) {
  res.send('Hi there, welcome to my assignment.');
});

app.get('/speak/:animalName', function(req, res) {
  let animalName = req.params.animalName.toLowerCase();
  let animal = {
    pig: { sound: "'Oink!'" },
    cow: { sound: "'Moo!'" },
    dog: { sound: "'Woof Woof!'" },
    raven: { sound: "'I'm gonna send D'Angelo's inappropriate messages!'" },
    cat: { sound: "'Meow'" }
  };

  if (!animal[animalName]) {
    res.send('Sorry, there is no such animal.');
  }

  res.send('The ' + animalName + ' says ' + animal[animalName].sound + '.');
});

app.get('/repeat/:text/:count', function(req, res) {
  let text = req.params.text;
  let count = Number(req.params.count);
  let result = '';

  for (let i = 0; i < count; i++) {
    result += text + ' ';
  }

  res.send(result);
});

app.get('*', function(req, res) {
  res.send('Page not found. Do you need a map?');
});

app.listen(3000, function() {
  console.log('ExpressExercise server has started!');
});
