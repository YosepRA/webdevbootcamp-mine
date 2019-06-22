var request = require('request');

request('https://jsonplaceholder.typicode.com/posts/1', function(
  error,
  res,
  body
) {
  if (!error && res.statusCode == 200) {
    let parsedData = JSON.parse(body);
    console.log(parsedData);
  }
});
