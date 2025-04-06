const { displayGroceryList } = require("../../src/utils/displayUtils");

// Mock console.log
global.console = {
  log: jest.fn(),
};

describe("displayUtils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("displayGroceryList", () => {
    it("should display grocery list correctly", () => {
      // Setup
      const ingredientQuantities = {
        Bread: 4,
        "Peanut butter": 30,
        Salmon: 120,
      };

      // Execute
      displayGroceryList(ingredientQuantities);

      // Verify
      expect(console.log).toHaveBeenCalledTimes(5); // Header + 3 items + separator
      expect(console.log).toHaveBeenCalledWith("\nGrocery List:");
      expect(console.log).toHaveBeenCalledWith("-------------");
      expect(console.log).toHaveBeenCalledWith("Bread: 4.00");
      expect(console.log).toHaveBeenCalledWith("Peanut butter: 30.00");
      expect(console.log).toHaveBeenCalledWith("Salmon: 120.00");
    });

    it("should handle empty grocery list", () => {
      // Setup
      const ingredientQuantities = {};

      // Execute
      displayGroceryList(ingredientQuantities);

      // Verify
      expect(console.log).toHaveBeenCalledTimes(2); // Only header and separator
      expect(console.log).toHaveBeenCalledWith("\nGrocery List:");
      expect(console.log).toHaveBeenCalledWith("-------------");
    });
  });
});
