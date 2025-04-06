require("dotenv").config();
const { HfInference } = require("@huggingface/inference");

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

/**
 * Categorizes ingredients into Woolworths sections
 * @param {Object} ingredientQuantities - Ingredient quantities
 * @returns {Promise<Object>} Categorized ingredients
 */
async function categorizeIngredients(ingredientQuantities) {
  const ingredients = Object.keys(ingredientQuantities);

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

  try {
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.3,
        return_full_text: false,
      },
    });

    // Extract the JSON from the response
    const jsonMatch = response.generated_text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON response from model");
    }

    const categorized = JSON.parse(jsonMatch[0]);

    // Create a new object with quantities preserved
    const result = {};
    for (const [category, items] of Object.entries(categorized)) {
      result[category] = {};
      items.forEach((item) => {
        if (ingredientQuantities[item]) {
          result[category][item] = ingredientQuantities[item];
        }
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
