/* ========== SERVER INIT ========== */

var express = require('express');
var app = express();
var OAuth = require('oauth');

app.set('view engine', 'ejs');

/* ========== YAHOO WEATHER API ========== */

var parsedWeatherData;

var header = {
  'X-Yahoo-App-Id': 'Hvpzma30'
};
var request = new OAuth.OAuth(
  null,
  null,
  'dj0yJmk9SHpDb2F0cUFRUmY3JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWI2',
  'f2bcbb5198c122725f499c8d155c87f78196c903',
  '1.0',
  null,
  'HMAC-SHA1',
  null,
  header
);
request.get(
  'https://weather-ydn-yql.media.yahoo.com/forecastrss?lat=-8.02&lon=112.2327601&format=json&u=c',
  null,
  null,
  function(err, data, result) {
    if (err) {
      console.log(err);
    } else {
      weatherData(data);
    }
  }
);

function weatherData(data) {
  parsedWeatherData = JSON.parse(data);
}

/* ========== ROUTES ========== */

app.get('/', function(req, res) {
  res.render('home');
});

// "/forecast"
app.get('/forecast', function(req, res) {
  if (!parsedWeatherData) {
    res.send('Data is still loading. Please reload after a few moment.');
    return;
  }

  let forecast = parsedWeatherData.forecasts; // Array

  res.render('forecast', { forecast: forecast });
});

app.listen(3000, function() {
  console.log('Yahoo Weather API Server has started!');
});
