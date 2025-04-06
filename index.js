console.log("Welcome to Asteroid!");

const fs = require("fs");
const { parse } = require("csv-parse/sync");

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

// Main function to process the files
function generateGroceryList(weekNumber) {
  try {
    // Read the CSV files
    const mealPlan = readCSV(`MPInputW${weekNumber}.csv`);
    const recipeDB = readCSV("RecipeDatabase.csv");

    // Count meal occurrences
    const mealCounts = countMeals(mealPlan);

    // Calculate ingredient quantities
    const ingredientQuantities = calculateIngredients(mealCounts, recipeDB);

    // Print the grocery list
    console.log("\nGrocery List:");
    console.log("-------------");
    for (const [ingredient, quantity] of Object.entries(ingredientQuantities)) {
      console.log(`${ingredient}: ${quantity.toFixed(2)}`);
    }
  } catch (error) {
    console.error("Error processing files:", error.message);
  }
}

// Get week number from command line arguments
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

generateGroceryList(weekNumber);
