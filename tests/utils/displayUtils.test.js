const {
  displayGroceryList,
  saveGroceryList,
} = require("../../src/utils/displayUtils");
const fs = require("fs");

// Mock console.log and fs
global.console = {
  log: jest.fn(),
};
jest.mock("fs");

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
      expect(console.log).toHaveBeenCalledTimes(1);
      const output = console.log.mock.calls[0][0];
      expect(output).toContain("Grocery List:");
      expect(output).toContain("-------------");
      expect(output).toContain("Bread: 4.00");
      expect(output).toContain("Peanut butter: 30.00");
      expect(output).toContain("Salmon: 120.00");
      expect(output.split("\n").length).toBe(5); // header + separator + 3 items
    });

    it("should handle empty grocery list", () => {
      // Setup
      const ingredientQuantities = {};

      // Execute
      displayGroceryList(ingredientQuantities);

      // Verify
      expect(console.log).toHaveBeenCalledTimes(1);
      const output = console.log.mock.calls[0][0];
      expect(output).toContain("Grocery List:");
      expect(output).toContain("-------------");
      expect(output.split("\n").length).toBe(3); // header + separator + empty line
    });
  });

  describe("saveGroceryList", () => {
    it("should save grocery list to file", () => {
      // Setup
      const ingredientQuantities = {
        Bread: 4,
        "Peanut butter": 30,
      };
      const filename = "test_grocery_list.txt";

      // Execute
      saveGroceryList(ingredientQuantities, filename);

      // Verify
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        filename,
        expect.stringContaining("Grocery List:")
      );
      const savedContent = fs.writeFileSync.mock.calls[0][1];
      expect(savedContent).toContain("Bread: 4.00");
      expect(savedContent).toContain("Peanut butter: 30.00");
      expect(savedContent.split("\n").length).toBe(4); // header + separator + 2 items
    });

    it("should handle empty grocery list when saving", () => {
      // Setup
      const ingredientQuantities = {};
      const filename = "empty_grocery_list.txt";

      // Execute
      saveGroceryList(ingredientQuantities, filename);

      // Verify
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        filename,
        expect.stringContaining("Grocery List:")
      );
      const savedContent = fs.writeFileSync.mock.calls[0][1];
      expect(savedContent.split("\n").length).toBe(3); // header + separator + empty line
    });
  });
});
