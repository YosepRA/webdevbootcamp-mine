const express = require('express'),
  app = express();

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.listen(port, () => {
  console.log(`Server has started at port ${port}`);
});
