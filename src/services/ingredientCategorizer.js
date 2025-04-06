require("dotenv").config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Makes a request to the AI model to categorize ingredients
 * @param {string[]} ingredients - List of ingredients to categorize
 * @returns {Promise<Object>} Categorized ingredients
 */
async function requestCategorization(ingredients) {
  const prompt = `Categorize these ingredients into the following Woolworths sections:
  - Meat
  - Veg
  - Dairy
  - Aisles
  - Frozen
  
  Ingredients: ${ingredients.join(", ")}
  
  Return the response in JSON format with the following structure:
  {
    "Meat": ["ingredient1", "ingredient2"],
    "Veg": ["ingredient1", "ingredient2"],
    "Dairy": ["ingredient1", "ingredient2"],
    "Aisles": ["ingredient1", "ingredient2"],
    "Frozen": ["ingredient1", "ingredient2"]
  }`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that categorizes ingredients into grocery store sections. Always respond with valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
    max_tokens: 500,
  });

  const jsonResponse = response.choices[0].message.content;
  try {
    return JSON.parse(jsonResponse);
  } catch (error) {
    throw new Error("Failed to parse JSON response from model");
  }
}

/**
 * Categorizes ingredients into Woolworths sections
 * @param {Object} ingredientQuantities - Ingredient quantities
 * @returns {Promise<Object>} Categorized ingredients
 */
async function categorizeIngredients(ingredientQuantities) {
  const ingredients = Object.keys(ingredientQuantities);
  let categorized;
  let missingIngredients = ingredients;
  let attempts = 0;
  const maxAttempts = 3;

  try {
    // Initialize result with all categories
    const result = {
      Meat: {},
      Dairy: {},
      Aisles: {},
      Veg: {},
      Frozen: {},
      Uncategorized: {}, // New category for uncategorized ingredients
    };

    const categorizedIngredients = new Set();

    while (attempts < maxAttempts && missingIngredients.length > 0) {
      attempts++;
      console.log(
        `Attempt ${attempts} for ingredients: ${missingIngredients.join(", ")}`
      );

      // Make categorization attempt
      categorized = await requestCategorization(missingIngredients);

      // Process the categorization
      for (const [category, items] of Object.entries(categorized)) {
        if (!result[category]) {
          result[category] = {};
        }
        items.forEach((item) => {
          if (ingredientQuantities[item]) {
            result[category][item] = ingredientQuantities[item];
            categorizedIngredients.add(item);
          }
        });
      }

      // Update missing ingredients
      missingIngredients = ingredients.filter(
        (ingredient) => !categorizedIngredients.has(ingredient)
      );
    }

    // Add any remaining uncategorized ingredients to the Uncategorized category
    if (missingIngredients.length > 0) {
      console.log(
        `Adding ${missingIngredients.length} uncategorized ingredients to Uncategorized category`
      );
      missingIngredients.forEach((ingredient) => {
        result.Uncategorized[ingredient] = ingredientQuantities[ingredient];
      });
    }

    return result;
  } catch (error) {
    console.error("Error categorizing ingredients:", error);
    throw error;
  }
}

module.exports = {
  categorizeIngredients,
};
