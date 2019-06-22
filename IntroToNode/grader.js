// Create a function that will find the average score of a given array-of-number.

function average(scoresArr) {
  let total = 0;

  for (let i = 0; i < scoresArr.length; i++) {
    const score = scoresArr[i];
    // if its datatype is a number
    if (!isNaN(score)) {
      total += score;
    } else {
      console.error("Your list contains a data that is not a number.");

      return;
    }
  }

  return Math.round(total / scoresArr.length);
}

var scores1 = [90, 98, 89, 100, 100, 86, 94];
console.log(average(scores1)); // 94

var scores2 = [40, 65, 77, 82, 80, 54, 73, 63, 95, 49];
console.log(average(scores2)); // 68

var scores3 = [40, 60, "bing"];
console.log(average(scores3)); // Error: Type is not a number.
