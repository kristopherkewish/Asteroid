const fs = require("fs");

/**
 * Formats the grocery list as a string
 * @param {Object} ingredientQuantities - Ingredient quantities
 * @returns {string} Formatted grocery list
 */
function formatGroceryList(ingredientQuantities) {
  const entries = Object.entries(ingredientQuantities);
  let output = "Grocery List:\n";
  output += "-------------\n";

  if (entries.length === 0) {
    return output;
  }

  output += entries
    .map(([ingredient, quantity]) => `${ingredient}: ${quantity.toFixed(2)}`)
    .join("\n");

  return output;
}

/**
 * Displays the grocery list in the console
 * @param {Object} ingredientQuantities - Ingredient quantities
 */
function displayGroceryList(ingredientQuantities) {
  const formattedList = formatGroceryList(ingredientQuantities);
  console.log(formattedList);
}

/**
 * Saves the grocery list to a text file
 * @param {Object} ingredientQuantities - Ingredient quantities
 * @param {string} filename - Name of the output file
 */
function saveGroceryList(ingredientQuantities, filename) {
  const output = formatGroceryList(ingredientQuantities);
  fs.writeFileSync(filename, output);
}

module.exports = {
  displayGroceryList,
  saveGroceryList,
};
