const { readCSV } = require("../utils/csvUtils");

/**
 * Counts occurrences of each meal in the meal plan
 * @param {Array} mealPlan - Parsed meal plan data
 * @returns {Object} Meal counts
 */
function countMeals(mealPlan) {
  return mealPlan.reduce((counts, entry) => {
    counts[entry.Meal] = (counts[entry.Meal] || 0) + 1;
    return counts;
  }, {});
}

/**
 * Calculates total ingredient quantities needed
 * @param {Object} mealCounts - Count of each meal
 * @param {Array} recipeDB - Recipe database
 * @returns {Object} Total quantities for each ingredient
 */
function calculateIngredients(mealCounts, recipeDB) {
  return Object.entries(mealCounts).reduce((quantities, [meal, count]) => {
    recipeDB
      .filter((recipe) => recipe.Meal === meal)
      .forEach((ingredient) => {
        const name = ingredient.Ingredients;
        const amount = parseFloat(ingredient.AmountPerServe) * count;
        quantities[name] = (quantities[name] || 0) + amount;
      });
    return quantities;
  }, {});
}

/**
 * Generates a grocery list for a specific week
 * @param {number} weekNumber - Week number
 * @returns {Object} Grocery list with ingredient quantities
 */
function generateGroceryList(weekNumber) {
  const mealPlan = readCSV(`MPInputW${weekNumber}.csv`);
  const recipeDB = readCSV("RecipeDatabase.csv");

  const mealCounts = countMeals(mealPlan);
  return calculateIngredients(mealCounts, recipeDB);
}

module.exports = {
  generateGroceryList,
};
