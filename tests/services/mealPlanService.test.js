const { generateGroceryList } = require("../../src/services/mealPlanService");
const { readCSV } = require("../../src/utils/csvUtils");

// Mock the csvUtils module
jest.mock("../../src/utils/csvUtils");

describe("mealPlanService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateGroceryList", () => {
    it("should generate correct grocery list for a week", () => {
      // Setup mock data
      const mockMealPlan = [
        { Meal: "PB toast + yoghurt" },
        { Meal: "PB toast + yoghurt" },
        { Meal: "Salmon rice + veg" },
      ];

      const mockRecipeDB = [
        {
          Meal: "PB toast + yoghurt",
          Ingredients: "Bread",
          AmountPerServe: "2",
        },
        {
          Meal: "PB toast + yoghurt",
          Ingredients: "Peanut butter",
          AmountPerServe: "15",
        },
        {
          Meal: "Salmon rice + veg",
          Ingredients: "Salmon",
          AmountPerServe: "120",
        },
        {
          Meal: "Salmon rice + veg",
          Ingredients: "Cooked rice",
          AmountPerServe: "120",
        },
      ];

      // Setup mocks
      readCSV.mockImplementation((filePath) => {
        if (filePath.includes("MPInputW")) {
          return mockMealPlan;
        }
        return mockRecipeDB;
      });

      // Execute
      const result = generateGroceryList(1);

      // Verify
      expect(result).toEqual({
        Bread: 4, // 2 servings × 2 meals
        "Peanut butter": 30, // 15g × 2 meals
        Salmon: 120, // 120g × 1 meal
        "Cooked rice": 120, // 120g × 1 meal
      });
    });

    it("should handle empty meal plan", () => {
      // Setup
      readCSV.mockImplementation((filePath) => {
        if (filePath.includes("MPInputW")) {
          return [];
        }
        return [];
      });

      // Execute
      const result = generateGroceryList(1);

      // Verify
      expect(result).toEqual({});
    });

    it("should handle missing recipes", () => {
      // Setup
      const mockMealPlan = [{ Meal: "Unknown Meal" }];

      const mockRecipeDB = [];

      readCSV.mockImplementation((filePath) => {
        if (filePath.includes("MPInputW")) {
          return mockMealPlan;
        }
        return mockRecipeDB;
      });

      // Execute
      const result = generateGroceryList(1);

      // Verify
      expect(result).toEqual({});
    });
  });
});
