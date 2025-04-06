console.log("Welcome to Asteroid!");

const { generateGroceryList } = require("./src/services/mealPlanService");
const {
  categorizeIngredients,
} = require("./src/services/ingredientCategorizer");
const {
  displayGroceryList,
  saveGroceryList,
} = require("./src/utils/displayUtils");

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

async function main() {
  try {
    const weekNumber = processArguments();
    const groceryList = generateGroceryList(weekNumber);

    // Categorize the ingredients
    const categorizedList = await categorizeIngredients(groceryList);

    // Display in console
    displayGroceryList(categorizedList);

    // Save to file
    const filename = `grocery_list_week_${weekNumber}.txt`;
    saveGroceryList(categorizedList, filename);
    console.log(`\nGrocery list has been saved to ${filename}`);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
