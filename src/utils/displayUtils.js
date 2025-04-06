/**
 * Formats and displays the grocery list
 * @param {Object} ingredientQuantities - Ingredient quantities
 */
function displayGroceryList(ingredientQuantities) {
  console.log("\nGrocery List:");
  console.log("-------------");
  for (const [ingredient, quantity] of Object.entries(ingredientQuantities)) {
    console.log(`${ingredient}: ${quantity.toFixed(2)}`);
  }
}

module.exports = {
  displayGroceryList,
};
