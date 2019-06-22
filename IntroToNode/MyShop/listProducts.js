var faker = require("faker"),
  commerce = faker.commerce;

for (let i = 1; i <= 10; i++) {
  console.log(
    i + ". " + commerce.productName() + " - " + commerce.price(50, 200, 2, "$")
    // i + ". " + commerce.productName() + " - " + commerce.price()
  );
}
