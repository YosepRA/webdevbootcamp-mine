window.onload = function() {
  var command;
  var status = true;
  var toDoList = [];

  while (status) { // True if user hasn't quit and changing to false will stop the loop.
    command = prompt('What would you like to do?').toLowerCase();

    if (command == 'new') {
      createNewList();
    } else if (command == 'list') {
      showList();
    } else if (command == 'delete') {
      let itemIndex = Number(prompt('Enter the item\'s number to be deleted')) - 1;

      if (isNaN(itemIndex)) {
        alert('Error: Please enter a valid number.');
        continue;
      } else {
        deleteList(itemIndex);
      }
    } else if (command == 'quit') {
      status = false;
      break;
    } else {
      continue;
    }
  }

  function createNewList() {
    let newItem = prompt('Enter your new to do!');

    toDoList.push(newItem);
    
    console.log(newItem + ' added to the list');
  }

  function showList() {
    console.log('***********');
    toDoList.forEach(function(item, index) {
      console.log((index + 1) + ': ' + item);
    });
    console.log('***********');
  }

  function deleteList(index) {
    let deleted = toDoList.splice(index, 1);
    deleted.forEach(function (item) {
      console.log(item + ' has been deleted.');
    });
  }
};

