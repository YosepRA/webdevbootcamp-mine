/* ========== ROUTES ========== */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

let movieData;

/* ========== FUNCTIONS ========== */

function getMovieData(obj) {
  let isQuery = Boolean(obj.query);
  let separator = isQuery ? ' ' : '_';
  let pattern = new RegExp(separator, 'g');
  let apiQuery = isQuery ? 's' : 't';
  let title = obj.query || obj.params;

  let titleQuery = title.replace(pattern, '+'); // Movie title with "+" as separator
  let requestLink = isQuery
    ? `http://www.omdbapi.com/?${apiQuery}=${titleQuery}&apikey=thewdb`
    : `http://www.omdbapi.com/?${apiQuery}=${titleQuery}&plot=full&apikey=thewdb`;

  request(requestLink, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      movieData = JSON.parse(body);
    }
  });
}

/* ========== ROUTES ========== */

// root
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/movies', (req, res) => {
  // let movieData = parsedData ? parsedData.Search : [];

  res.render('movies');
});

// "/movies/s" => Movie Search
app.get('/movies/s', (req, res) => {
  /* let searchQuery = req.query.searchTitle.replace(/ /g, '+');
  let requestLink = `http://www.omdbapi.com/?s=${searchQuery}&apikey=thewdb`;
  // let movieData;

  request(requestLink, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      movieData = JSON.parse(body);
    }
  });

  setTimeout(() => {
    res.render('searchMovie', {
      movieData: movieData
        ? movieData
        : {
            Response: 'False',
            Error: 'Please try again in a few moment.'
          }
    });
  }, 2000); */

  getMovieData({ query: req.query.searchTitle });

  setTimeout(() => {
    res.render('searchMovie', {
      movieData: movieData
        ? movieData
        : {
            Response: 'False',
            Error: 'Please try again in a few moment.'
          }
    });
  }, 2000);
});

// "/movies/m/:movieTitle" => Movie Details
// e.g: /movies/m/The_Rise_of_The_Guardians
app.get('/movies/m/:movieTitle', (req, res) => {
  /* let titleQuery = req.params.movieTitle.replace(/_/g, '+'); // Movie title with "+" as separator
  let requestLink = `http://www.omdbapi.com/?t=${titleQuery}&plot=full&apikey=thewdb`;
  // let movieData;

  request(requestLink, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      movieData = JSON.parse(body);
    }
  });

  setTimeout(() => {
    res.render('movieDetail', {
      movieData: movieData
        ? movieData
        : {
            Response: 'False',
            Error: 'Please try again in a few moment.'
          }
    });
  }, 2000); */

  getMovieData({ params: req.params.movieTitle });

  setTimeout(() => {
    res.render('movieDetail', {
      movieData: movieData
        ? movieData
        : {
            Response: 'False',
            Error: 'Please try again in a few moment.'
          }
    });
  }, 2000);
});

app.get('*', (req, res) => {
  res.render('notFound');
});

app.listen(3000, () => {
  console.log('Movie Search App Server has started!');
});
