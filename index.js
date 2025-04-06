console.log("Welcome to Asteroid!");

const { generateGroceryList } = require("./src/services/mealPlanService");
const { displayGroceryList } = require("./src/utils/displayUtils");

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
