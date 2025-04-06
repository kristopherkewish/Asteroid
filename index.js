console.log("Welcome to Asteroid!");

const fs = require("fs");
const { parse } = require("csv-parse/sync");
const { generateGroceryList } = require("./src/services/mealPlanService");
const { displayGroceryList } = require("./src/utils/displayUtils");

// Function to read and parse CSV file
function readCSV(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });
}

// Function to count meal occurrences
function countMeals(mealPlan) {
  const mealCounts = {};
  mealPlan.forEach((entry) => {
    const meal = entry.Meal;
    mealCounts[meal] = (mealCounts[meal] || 0) + 1;
  });
  return mealCounts;
}

// Function to calculate ingredient quantities
function calculateIngredients(mealCounts, recipeDB) {
  const ingredientQuantities = {};

  // Process each meal and its ingredients
  for (const [meal, count] of Object.entries(mealCounts)) {
    const mealIngredients = recipeDB.filter((recipe) => recipe.Meal === meal);

    mealIngredients.forEach((ingredient) => {
      const name = ingredient.Ingredients;
      const amount = parseFloat(ingredient.AmountPerServe) * count;

      if (ingredientQuantities[name]) {
        ingredientQuantities[name] += amount;
      } else {
        ingredientQuantities[name] = amount;
      }
    });
  }

  return ingredientQuantities;
}

/**
 * Validates and processes command line arguments
 * @returns {number} Week number
 */
function processArguments() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Please provide a week number as an argument");
    console.log("Usage: npm start <week_number>");
    process.exit(1);
  }

  const weekNumber = parseInt(args[0]);
  if (isNaN(weekNumber)) {
    console.error("Week number must be a valid number");
    process.exit(1);
  }

  return weekNumber;
}

try {
  const weekNumber = processArguments();
  const groceryList = generateGroceryList(weekNumber);
  displayGroceryList(groceryList);
} catch (error) {
  console.error("Error:", error.message);
  process.exit(1);
}
