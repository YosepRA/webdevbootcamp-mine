(function() {
  /* ====================================== ELEMENT CACHING START ====================================== */

  var headerSect = document.getElementById('header');
  var colorHint = document.querySelector('#header h2:nth-child(2)');
  var colorBox = document.querySelectorAll('#main td');
  var secondBoxRow = document.querySelector('#main tr:nth-child(2)');
  var msg = document.querySelector('li#msg');
  var newGame = document.querySelector('#mainNav ul li:first-child');
  var difficultiesList = document.querySelector('#difficulties');
  var alertBox = document.getElementById('alertBox');

  /* ====================================== ELEMENT CACHING START ====================================== */
  /* ====================================== MODEL STATE START ====================================== */

  // Correct Color object. It contains the RGB values of the correct color.
  var correctColor = {red: 0, green: 0, blue: 0};
  // Guess Colors model. Each of it reflects the index position of color box elements on the page.
  var guesses = [
    {red: 0, green: 0, blue:0},
    {red: 0, green: 0, blue:0},
    {red: 0, green: 0, blue:0},
    {red: 0, green: 0, blue:0},
    {red: 0, green: 0, blue:0},
    {red: 0, green: 0, blue:0}
  ];
  // This will maintain the state of the app and decide whether to:
  // - Generate colors for first three OR all of color boxes.
  // - Hide or show the last three color boxes.
  var difficulties = 'hard';

  init(); // Initialize when page loads.

/* ====================================== MODEL STATE START ====================================== */
  
  /* ====================================== FUNCTIONS START ====================================== */

  function init() {
    // Set Event Listeners
    setupNewGameBtn();
    setupColorBox();
    setupDifficulties();
    // Set App state.
    generateColor(difficulties);
    toggleColorBox(difficulties);
    toggleDifficulties(difficulties);
  }

  function setupNewGameBtn() {
    // Assigning click event on NEW COLOR to restart the app.
    newGame.addEventListener('click', function (event) {
      // Prevent <a> normal behavior (which is to direct to new page) to happen.
      event.preventDefault();
      // Generate New Colors
      generateColor(difficulties);
      // Change newGame textContent to "NEW COLOR";
      this.firstElementChild.textContent = 'NEW COLORS';
      // Reset the message feedback.
      msg.textContent = 'Guess It!';
    });
  }

  function setupColorBox() {
    // Assigning click event to each color boxes.
    for (let i = 0; i < colorBox.length; i++) {
      const element = colorBox[i];

      element.addEventListener('click', function () {
        // Check if the game is over by checking the message feedback textContent.
        if (msg.textContent === 'Correct!') {
          // Show alert box.
          alertBox.classList.remove('d-none');
          // Write its content.
          alertBox.textContent = 'The Game has ended. Click "PLAY AGAIN?" to restart.'
          return;
        } 
        guessColor(this);
      });
    }
  }

  function setupDifficulties() {
    // Assigning click event delegation on difficulties list.
    difficultiesList.addEventListener('click', function (event) {
      event.preventDefault();
      let target = event.target;
      if (target.tagName !== 'A') { // If target isn't an <a> element. 
        return; // Ignore.
      }
      difficulties = target.id; // Assign the difficulties state.

      toggleDifficulties(difficulties); // Change the chosen link state styling.
      generateColor(difficulties); // Generate colors based on it.
      toggleColorBox(difficulties); // Toggle whether to show or hide the last three color boxes.
      newGame.firstElementChild.textContent = 'NEW COLORS'; // Change newGame textContent to "NEW COLOR";
      msg.textContent = 'Guess It!'; // Reset the message feedback.
    });
  }

  // generateColor(string)
  // To generate colors for colorBox and correctColor based on the type of difficulties given as an argument.
  function generateColor(difficulties) { 
    let amount;
    if (difficulties === 'easy') {
      amount = 3;
    } else if (difficulties === 'hard') {
      amount = 6;
    }
  
    generateColorBox(amount);
    generateCorrectColor(amount);

    // Reset header section's background color.
    headerSect.style.backgroundColor = '';
    // Hide the alertBox container.
    alertBox.classList.add('d-none');
  }

  // toggleColorBox(string)
  // To toggle whether to show 3 or 6 color boxes.
  function toggleColorBox(difficulties) {
    if (difficulties === 'easy') {
      secondBoxRow.classList.add('d-none'); // Hide the last three boxes. ~
    } else if (difficulties === 'hard') {
      secondBoxRow.classList.remove('d-none'); // ~ Otherwise, show it.
    }
  }

  // toggleDifficulties(string)
  // To apply styling to difficulties mode links to show which one is currently active.
  function toggleDifficulties(difficulties) {
    if (difficulties === 'easy') {
      difficultiesList.children[0].classList.add('chosen');
      difficultiesList.children[1].classList.remove('chosen');
    } else if (difficulties === 'hard') {
      difficultiesList.children[1].classList.add('chosen');
      difficultiesList.children[0].classList.remove('chosen');
    }
  }

  // generateColorBox(number)
  // To generate the color boxes model array and apply those colors to color boxes.
  function generateColorBox(amount) {
    // Generate the color boxes model array.
    for (let i = 0; i < amount; i++) {
      guesses[i] = generateRGB();
    }

    // Change the background style property of every colorBox elements on the page reflecting its model's value.
    for (let i = 0; i < amount; i++) {
      const color = colorBox[i];
      const newGuessColor = createRGBString(guesses[i].red, guesses[i].green, guesses[i].blue);

      color.style.backgroundColor = newGuessColor;

      // Show all color boxes.
      color.classList.remove('body-color');
    }
  }

  // generateCorrectColor(number)
  // To choose one random color value from color box array and update the display for correct color hint.
  function generateCorrectColor(amount) {
    // Choose one random color from generated colors of "guesses" array.
    let randomColorIndex = Math.floor(Math.random() * amount);
    correctColor = guesses[randomColorIndex];
    // Change the color's hint text.
    let newCorrectColor = createRGBString(correctColor.red, correctColor.green, correctColor.blue);
    colorHint.textContent = newCorrectColor;
    
  }

  // generateRGB()
  // To generate rgb value and return an object containing generated color code.
  function generateRGB() {
    let color = {red: 0, green: 0, blue: 0};
    color.red = Math.floor(Math.random() * 256);
    color.green = Math.floor(Math.random() * 256);
    color.blue = Math.floor(Math.random() * 256);

    return color;
  }

  // createRGBString(number, number, number)
  // To create a new "rgb(red, green, blue)" string format to assign it to element's style property.
  function createRGBString(red, green, blue) {
    return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
  }

  function guessColor(el) {
    // The Guess Checking Main Logic Block.
    if (checkGuess(el)) { // If the guess is correct.
      // Change all td color and header section's background color
      correctColorChange(el);
      // Change newGame link textContent to "PLAY AGAIN?"
      newGame.firstElementChild.textContent = 'PLAY AGAIN?';
      // Change message to "Correct!"
      msg.textContent = 'Correct!';
    } else { // if the guess false
      // Hide the color box.
      el.classList.add('body-color');
      // Change message to "Try Again"
      msg.textContent = 'Try Again';
    }
  }
  
  // checkGuess(element)
  // To check the guess based on given element node.
  function checkGuess(el) {
    // Find the element's index number prior to the amount of color box.
    let elIndex = findElIndex(el);

    // Compare correctColor with guessColor.
    for (const key in correctColor) {
      if (correctColor.hasOwnProperty(key)) {
        const colorCode = correctColor[key];
        if (colorCode !== guesses[elIndex][key]) { // guesses[elIndex][key], find index of color box element reflecting "guesses" array.
          return false; // If there are any incorrect color code comparison, return false.
        }
      }
    }
    return true; // If all RGB codes were checked and they are all the same, returns true. Means, the guess is correct.
  }

  // correctColorChange(array)
  // To change the background color of all color box and header section to the correct color.
  function correctColorChange(el) {
    let elIndex = findElIndex(el); // Find the element's index number.
    let color = guesses[elIndex]; // Find the color object inside "guesses" array.
    // let newColorStyle = 'rgb(' + color.red + ', ' + color.green + ', ' + color.blue + ')';
    let newColorStyle = createRGBString(color.red, color.green, color.blue);
    // Change header section's color.
    headerSect.style.backgroundColor = newColorStyle;
    // Change all color box color.
    for (let i = 0; i < colorBox.length; i++) {
      const td = colorBox[i];

      td.style.backgroundColor = newColorStyle;

      td.classList.remove('body-color');
    }
  }

  // findElIndex(element)
  // To find element index inside a colorBox.
  function findElIndex(el) {
    let elIndex;
    for (let i = 0; i < colorBox.length; i++) {
      const element = colorBox[i];
      if (element === el) {
        elIndex = i;
      }
    }
    return elIndex;
  }

  

  /* ====================================== FUNCTIONS END ====================================== */

}());