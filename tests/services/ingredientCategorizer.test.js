const {
  categorizeIngredients,
} = require("../../src/services/ingredientCategorizer");

// Mock the OpenAI module
jest.mock("openai", () => {
  const mockCreate = jest.fn();
  return {
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    })),
    OpenAI: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    })),
    mockCreate, // Export the mock function for direct access
  };
});

// Get direct access to the mock function
const { mockCreate } = require("openai");

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

      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: `{
                "Meat": ["Salmon"],
                "Dairy": ["Yoghurt"],
                "Aisles": ["Bread", "Peanut butter"],
                "Veg": ["Broccoli"],
                "Frozen": ["Frozen peas"]
              }`,
            },
          },
        ],
      });

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
      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(mockCreate).toHaveBeenCalledWith({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that categorizes ingredients into grocery store sections. Always respond with valid JSON.",
          },
          {
            role: "user",
            content: expect.stringContaining("Categorize these ingredients"),
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
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

      mockCreate
        .mockResolvedValueOnce({
          choices: [
            {
              message: {
                content: `{
                  "Meat": ["Salmon"],
                  "Dairy": ["Yoghurt"],
                  "Aisles": ["Bread"],
                  "Veg": [],
                  "Frozen": []
                }`,
              },
            },
          ],
        })
        .mockResolvedValueOnce({
          choices: [
            {
              message: {
                content: `{
                  "Meat": [],
                  "Dairy": [],
                  "Aisles": ["Peanut butter"],
                  "Veg": ["Broccoli"],
                  "Frozen": []
                }`,
              },
            },
          ],
        })
        .mockResolvedValueOnce({
          choices: [
            {
              message: {
                content: `{
                  "Meat": [],
                  "Dairy": [],
                  "Aisles": [],
                  "Veg": [],
                  "Frozen": ["Frozen peas"]
                }`,
              },
            },
          ],
        });

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
      expect(mockCreate).toHaveBeenCalledTimes(3);
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

      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: `{
                "Meat": ["Salmon"],
                "Dairy": ["Yoghurt"],
                "Aisles": ["Bread", "Peanut butter"],
                "Veg": ["Broccoli"],
                "Frozen": ["Frozen peas"]
              }`,
            },
          },
        ],
      });

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
      expect(mockCreate).toHaveBeenCalledTimes(3);
    });

    it("should handle empty ingredient list", async () => {
      // Setup
      const ingredientQuantities = {};

      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: `{
                "Meat": [],
                "Dairy": [],
                "Aisles": [],
                "Veg": [],
                "Frozen": []
              }`,
            },
          },
        ],
      });

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

      mockCreate.mockRejectedValue(new Error("API Error"));

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

      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: "Invalid JSON response",
            },
          },
        ],
      });

      // Execute and Verify
      await expect(categorizeIngredients(ingredientQuantities)).rejects.toThrow(
        "Failed to parse JSON response from model"
      );
    });
  });
});
