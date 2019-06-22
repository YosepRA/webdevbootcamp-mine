const express = require('express');
const app = express();
const request = require('request');

app.set('view engine', 'ejs');

/* ========== ROUTES ========== */

/* 'root' => homepage */
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/search', (req, res) => {
  res.render('search');
});

app.get('/results', (req, res) => {
  const searchQuery = req.query.searchTitle;

  request(
    `http://www.omdbapi.com/?s=${searchQuery}&apikey=thewdb`,
    (error, respond, body) => {
      if (!error && respond.statusCode == 200) {
        const movieData = JSON.parse(body);
        res.render('results', { movieData: movieData });
      }
    }
  );
});

app.get('/movie/:imdbID', (req, res) => {
  const imdbID = req.params.imdbID;
  const link = `http://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=thewdb`;

  request(link, (error, respond, body) => {
    if (!error && respond.statusCode == 200) {
      const movieData = JSON.parse(body);
      res.render('movie', { movieData: movieData });
    }
  });
});

app.get('*', (req, res) => {
  res.render('notFound');
});

app.listen(3000, () => {
  console.log('Movie Search App Server has started!');
});
