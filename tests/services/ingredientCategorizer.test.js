const {
  categorizeIngredients,
} = require("../../src/services/ingredientCategorizer");
const { HfInference } = require("@huggingface/inference");

// Mock the HfInference module
jest.mock("@huggingface/inference", () => {
  const mockTextGeneration = jest.fn();
  return {
    HfInference: jest.fn().mockImplementation(() => ({
      textGeneration: mockTextGeneration,
    })),
    mockTextGeneration, // Export the mock function for direct access
  };
});

// Get direct access to the mock function
const { mockTextGeneration } = require("@huggingface/inference");

describe("ingredientCategorizer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("categorizeIngredients", () => {
    it("should categorize ingredients correctly in first attempt", async () => {
      // Setup
      const ingredientQuantities = {
        Salmon: 120,
        Yoghurt: 200,
        Bread: 4,
        "Peanut butter": 30,
        Broccoli: 100,
        "Frozen peas": 150,
      };

      const mockResponse = {
        generated_text: `{
          "Meat": ["Salmon"],
          "Dairy": ["Yoghurt"],
          "Aisles": ["Bread", "Peanut butter"],
          "Veg": ["Broccoli"],
          "Frozen": ["Frozen peas"]
        }`,
      };

      mockTextGeneration.mockResolvedValue(mockResponse);

      // Execute
      const result = await categorizeIngredients(ingredientQuantities);

      // Verify
      expect(result).toEqual({
        Meat: {
          Salmon: 120,
        },
        Dairy: {
          Yoghurt: 200,
        },
        Aisles: {
          Bread: 4,
          "Peanut butter": 30,
        },
        Veg: {
          Broccoli: 100,
        },
        Frozen: {
          "Frozen peas": 150,
        },
        Uncategorized: {},
      });

      // Verify the prompt was constructed correctly
      expect(mockTextGeneration).toHaveBeenCalledTimes(1);
      expect(mockTextGeneration).toHaveBeenCalledWith({
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        inputs: expect.stringContaining("Categorize these ingredients"),
        parameters: {
          max_new_tokens: 500,
          temperature: 0.3,
          return_full_text: false,
        },
      });
    });

    it("should retry categorization for missing ingredients up to 3 times", async () => {
      // Setup
      const ingredientQuantities = {
        Salmon: 120,
        Yoghurt: 200,
        Bread: 4,
        "Peanut butter": 30,
        Broccoli: 100,
        "Frozen peas": 150,
      };

      // First attempt misses some ingredients
      const firstMockResponse = {
        generated_text: `{
          "Meat": ["Salmon"],
          "Dairy": ["Yoghurt"],
          "Aisles": ["Bread"],
          "Veg": [],
          "Frozen": []
        }`,
      };

      // Second attempt categorizes some more ingredients
      const secondMockResponse = {
        generated_text: `{
          "Meat": [],
          "Dairy": [],
          "Aisles": ["Peanut butter"],
          "Veg": ["Broccoli"],
          "Frozen": []
        }`,
      };

      // Third attempt categorizes the last ingredient
      const thirdMockResponse = {
        generated_text: `{
          "Meat": [],
          "Dairy": [],
          "Aisles": [],
          "Veg": [],
          "Frozen": ["Frozen peas"]
        }`,
      };

      mockTextGeneration
        .mockResolvedValueOnce(firstMockResponse)
        .mockResolvedValueOnce(secondMockResponse)
        .mockResolvedValueOnce(thirdMockResponse);

      // Execute
      const result = await categorizeIngredients(ingredientQuantities);

      // Verify
      expect(result).toEqual({
        Meat: {
          Salmon: 120,
        },
        Dairy: {
          Yoghurt: 200,
        },
        Aisles: {
          Bread: 4,
          "Peanut butter": 30,
        },
        Veg: {
          Broccoli: 100,
        },
        Frozen: {
          "Frozen peas": 150,
        },
        Uncategorized: {},
      });

      // Verify all three attempts were made
      expect(mockTextGeneration).toHaveBeenCalledTimes(3);
    });

    it("should add uncategorized ingredients to Uncategorized category after 3 attempts", async () => {
      // Setup
      const ingredientQuantities = {
        Salmon: 120,
        Yoghurt: 200,
        Bread: 4,
        "Peanut butter": 30,
        Broccoli: 100,
        "Frozen peas": 150,
        "Mystery Ingredient": 50,
      };

      // All attempts miss "Mystery Ingredient"
      const mockResponse = {
        generated_text: `{
          "Meat": ["Salmon"],
          "Dairy": ["Yoghurt"],
          "Aisles": ["Bread", "Peanut butter"],
          "Veg": ["Broccoli"],
          "Frozen": ["Frozen peas"]
        }`,
      };

      mockTextGeneration.mockResolvedValue(mockResponse);

      // Execute
      const result = await categorizeIngredients(ingredientQuantities);

      // Verify
      expect(result).toEqual({
        Meat: {
          Salmon: 120,
        },
        Dairy: {
          Yoghurt: 200,
        },
        Aisles: {
          Bread: 4,
          "Peanut butter": 30,
        },
        Veg: {
          Broccoli: 100,
        },
        Frozen: {
          "Frozen peas": 150,
        },
        Uncategorized: {
          "Mystery Ingredient": 50,
        },
      });

      // Verify three attempts were made
      expect(mockTextGeneration).toHaveBeenCalledTimes(3);
    });

    it("should handle empty ingredient list", async () => {
      // Setup
      const ingredientQuantities = {};

      const mockResponse = {
        generated_text: `{
          "Meat": [],
          "Dairy": [],
          "Aisles": [],
          "Veg": [],
          "Frozen": []
        }`,
      };

      mockTextGeneration.mockResolvedValue(mockResponse);

      // Execute
      const result = await categorizeIngredients(ingredientQuantities);

      // Verify
      expect(result).toEqual({
        Meat: {},
        Dairy: {},
        Aisles: {},
        Veg: {},
        Frozen: {},
        Uncategorized: {},
      });
    });

    it("should handle API errors gracefully", async () => {
      // Setup
      const ingredientQuantities = {
        Salmon: 120,
      };

      mockTextGeneration.mockRejectedValue(new Error("API Error"));

      // Execute and Verify
      await expect(categorizeIngredients(ingredientQuantities)).rejects.toThrow(
        "API Error"
      );
    });

    it("should handle invalid JSON response", async () => {
      // Setup
      const ingredientQuantities = {
        Salmon: 120,
      };

      const mockResponse = {
        generated_text: "Invalid JSON response",
      };

      mockTextGeneration.mockResolvedValue(mockResponse);

      // Execute and Verify
      await expect(categorizeIngredients(ingredientQuantities)).rejects.toThrow(
        "Failed to parse JSON response from model"
      );
    });
  });
});
