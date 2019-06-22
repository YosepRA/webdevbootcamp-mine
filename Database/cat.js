const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cat_app', { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('Database has been connected');
});

const catSchema = new mongoose.Schema({
  name: String,
  age: Number,
  temperament: String
});

catSchema.methods.speak = function() {
  let greeting = this.name ? 'Meow, my name is ' + this.name : "I don't have a name yet.";
  console.log(greeting);
};

const Cat = mongoose.model('Cat', catSchema);

// Add new data to DB.
/* let george = new Cat({
  name: 'George',
  age: 12,
  temperament: 'Cheerful'
});

george.save((err, cat) => {
  err ? console.log('Something went wrong') : console.log('Data has been saved to the DB');
  console.log(cat);

  if (err) {
    console.log('Something went wrong');
    console.log('Do Something else');
  } else {
    console.log('Data has been saved to the DB');
    console.log(cat);
  }
}); */

// Add new data to DB using .create() method.
/* Cat.create(
  {
    name: 'Mrs. Norris',
    age: 20,
    temperament: 'Evil'
  },
  (err, cat) => {
    if (err) {
      console.log('Something went wrong when creating a new cat data');
    } else {
      console.log('A new cat data has been saved to the DB');
      console.log(cat);
    }
  }
); */

// Retrieve data from DB and console.log each of it.
/* Cat.find({}, (err, cats) => {
  if (err) {
    console.log('Something went wrong when retrieving data.');
  } else {
    console.log('Retrieving data has been successful.');
    console.log(cats);
  }
}); */

// Using speak method to a newly created cat.
let norris = new Cat({
  name: 'Mrs Norris',
  age: 10,
  temperament: 'Evil'
});

norris.speak();
