const mongoose = require('mongoose'),
  Campground = require('./models/campground'),
  Comment = require('./models/comment');

const data = [
  {
    name: "Cloud's Rest",
    image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
  },
  {
    name: 'Desert Mesa',
    image: 'https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
  },
  {
    name: 'Canyon Floor',
    image: 'https://farm1.staticflickr.com/189/493046463_841a18169e.jpg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
  }
];

// Seeding the Database.
// Removing all the previous data in the DB, and adding the new one.
// The reason is (maybe) to start clean whenever the server starts. ~
// ~ Because if we don't do that, the data in the DB can get messy really fast ~
// ~ in the development process.
function seedDB() {
  // Remove all campgrounds from DB.
  Campground.deleteMany({}, err => {
    if (err) {
      console.log(err);
    } else {
      console.log('All campgrounds has been removed!');
      // Remove all comments from DB.
      Comment.deleteMany({}, err => {
        if (err) {
          console.log(err);
        } else {
          console.log('All comments has been removed!');
          // Add new data after cleaning the DB.
          data.forEach(camp => {
            Campground.create(camp, (err, camp) => {
              if (err) {
                console.log(err);
              } else {
                // console.log('New campground has been created!');
                // Create new comment for each of the camp in the array.
                Comment.create(
                  {
                    text:
                      'Black jack pirate lanyard haul wind port galleon gaff gun Letter of Marque parley. Transom Shiver me timbers chandler six pounders loot spike mizzen come about to go on account sutler.',
                    author: 'Black Jack'
                  },
                  (err, comment) => {
                    if (err) {
                      console.log(err);
                    } else {
                      // console.log('New comment has been created!');
                      camp.comments.push(comment);
                      // Don't forget to save. Because we just edited the newly created campground that already been saved ~
                      // ~ and updating it without saving it will end up with new changes not getting stored to the DB.
                      camp.save((err, camp) => {
                        if (err) {
                          console.log(err);
                        } else {
                          // console.log('Comment saved to DB');
                          console.log('Database seeding is done!');
                        }
                      });
                    }
                  }
                );
              }
            });
          });
        }
      });
    }
  });
}

module.exports = seedDB;
