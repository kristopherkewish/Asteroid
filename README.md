# Asteroid - Meal Planning and Grocery List Generator

Asteroid is a Node.js application that helps you generate organized grocery lists based on your meal plans. It uses AI to categorize ingredients and creates a well-structured shopping list.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- A Hugging Face API key

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/Asteroid.git
cd Asteroid
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Hugging Face API key:
   ```
   HUGGINGFACE_API_KEY=your_api_key_here
   ```

## Usage

To generate a grocery list for a specific week:

```bash
npm start <week_number>
```

For example, to generate a grocery list for week 4:

```bash
npm start 4
```

The application will:

1. Generate a grocery list based on the meal plan for the specified week
2. Categorize the ingredients using AI
3. Display the categorized list in the console
4. Save the list to a file named `grocery_list_week_<number>.txt`

## Project Structure

- `src/` - Source code directory
  - `services/` - Core business logic
  - `utils/` - Utility functions
- `tests/` - Test files
- `RecipeDatabase.csv` - Database of recipes
- `MPInputW4.csv` - Sample meal plan input

## CSV File Structure

### Meal Plan Input (MPInputW4.csv)

The meal plan CSV file should follow this structure:

```csv
Day,Meal
Monday,Meal Name 1
Monday,Meal Name 2
...
```

- `Day`: The day of the week (Monday through Sunday)
- `Meal`: The name of the meal as it appears in the RecipeDatabase.csv

### Recipe Database (RecipeDatabase.csv)

The recipe database CSV file should follow this structure:

```csv
Meal,Ingredients,AmountPerServe
Meal Name 1,Ingredient 1,100
Meal Name 1,Ingredient 2,50
...
```

- `Meal`: The name of the meal (must match exactly with names in the meal plan)
- `Ingredients`: The name of the ingredient
- `AmountPerServe`: The amount of the ingredient needed per serving (in grams or units)

Example meals include:

- PB toast + yoghurt
- Chicken kimchi toastie
- Burrito bowl
- Salmon rice + veg
- Spicy chicken fried rice
- Cereal bowl
- Apple + Yoghurt dip
- Meal out
- Fruit of choice

## Running Tests

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

## Dependencies

- csv-parse: For parsing CSV files
- @huggingface/inference: For AI-powered ingredient categorization
- dotenv: For environment variable management
- jest: For testing

## License

ISC
