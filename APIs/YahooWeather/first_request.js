var request = require('request');

request(
  'https://sonicweather.com/API/isPrecip.php?lat=41.95&long=-76.73&key=abcdefghijklmnop',
  function(err, res, body) {
    if (!err && res.statusCode == 200) {
      console.log(body);
    } else {
      console.log(err);
    }
  }
);
