const fs = require("fs");

/**
 * Formats a single category of ingredients
 * @param {string} category - Category name
 * @param {Object} ingredients - Ingredient quantities for the category
 * @returns {string} Formatted category section
 */
function formatCategory(category, ingredients) {
  let output = `\n\n${category}:\n`;
  output += "-".repeat(category.length + 1) + "\n";

  if (Object.keys(ingredients).length === 0) {
    return output + "None\n";
  }

  output += Object.entries(ingredients)
    .map(([ingredient, quantity]) => `${ingredient}: ${quantity.toFixed(2)}`)
    .join("\n");

  return output;
}

/**
 * Formats the grocery list as a string
 * @param {Object} categorizedIngredients - Categorized ingredient quantities
 * @returns {string} Formatted grocery list
 */
function formatGroceryList(categorizedIngredients) {
  let output = "Grocery List (Categorized by Woolworths Section):\n";
  output += "---------------------------------------------\n";

  const categories = ["Meat", "Veg", "Dairy", "Aisles", "Frozen"];

  categories.forEach((category) => {
    output += formatCategory(category, categorizedIngredients[category] || {});
  });

  return output;
}

/**
 * Displays the grocery list in the console
 * @param {Object} categorizedIngredients - Categorized ingredient quantities
 */
function displayGroceryList(categorizedIngredients) {
  const formattedList = formatGroceryList(categorizedIngredients);
  console.log(formattedList);
}

/**
 * Saves the grocery list to a text file
 * @param {Object} categorizedIngredients - Categorized ingredient quantities
 * @param {string} filename - Name of the output file
 */
function saveGroceryList(categorizedIngredients, filename) {
  const output = formatGroceryList(categorizedIngredients);
  fs.writeFileSync(filename, output);
}

module.exports = {
  displayGroceryList,
  saveGroceryList,
};
