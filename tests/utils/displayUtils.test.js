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
    it("should display categorized grocery list correctly", () => {
      // Setup
      const categorizedIngredients = {
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
        Veg: {},
        Frozen: {},
      };

      // Execute
      displayGroceryList(categorizedIngredients);

      // Verify
      expect(console.log).toHaveBeenCalledTimes(1);
      const output = console.log.mock.calls[0][0];
      expect(output).toContain(
        "Grocery List (Categorized by Woolworths Section):"
      );
      expect(output).toContain("---------------------------------------------");
      expect(output).toContain("Meat:");
      expect(output).toContain("Salmon: 120.00");
      expect(output).toContain("Dairy:");
      expect(output).toContain("Yoghurt: 200.00");
      expect(output).toContain("Aisles:");
      expect(output).toContain("Bread: 4.00");
      expect(output).toContain("Peanut butter: 30.00");
      expect(output).toContain("Veg:");
      expect(output).toContain("None");
      expect(output).toContain("Frozen:");
      expect(output).toContain("None");
    });

    it("should handle empty grocery list", () => {
      // Setup
      const categorizedIngredients = {
        Meat: {},
        Dairy: {},
        Aisles: {},
        Veg: {},
        Frozen: {},
      };

      // Execute
      displayGroceryList(categorizedIngredients);

      // Verify
      expect(console.log).toHaveBeenCalledTimes(1);
      const output = console.log.mock.calls[0][0];
      expect(output).toContain(
        "Grocery List (Categorized by Woolworths Section):"
      );
      expect(output).toContain("---------------------------------------------");
      expect(output).toContain("Meat:");
      expect(output).toContain("None");
      expect(output).toContain("Dairy:");
      expect(output).toContain("None");
      expect(output).toContain("Aisles:");
      expect(output).toContain("None");
      expect(output).toContain("Veg:");
      expect(output).toContain("None");
      expect(output).toContain("Frozen:");
      expect(output).toContain("None");
    });
  });

  describe("saveGroceryList", () => {
    it("should save categorized grocery list to file", () => {
      // Setup
      const categorizedIngredients = {
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
        Veg: {},
        Frozen: {},
      };
      const filename = "test_grocery_list.txt";

      // Execute
      saveGroceryList(categorizedIngredients, filename);

      // Verify
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        filename,
        expect.stringContaining(
          "Grocery List (Categorized by Woolworths Section):"
        )
      );
      const savedContent = fs.writeFileSync.mock.calls[0][1];
      expect(savedContent).toContain("Meat:");
      expect(savedContent).toContain("Salmon: 120.00");
      expect(savedContent).toContain("Dairy:");
      expect(savedContent).toContain("Yoghurt: 200.00");
      expect(savedContent).toContain("Aisles:");
      expect(savedContent).toContain("Bread: 4.00");
      expect(savedContent).toContain("Peanut butter: 30.00");
      expect(savedContent).toContain("Veg:");
      expect(savedContent).toContain("None");
      expect(savedContent).toContain("Frozen:");
      expect(savedContent).toContain("None");
    });

    it("should handle empty grocery list when saving", () => {
      // Setup
      const categorizedIngredients = {
        Meat: {},
        Dairy: {},
        Aisles: {},
        Veg: {},
        Frozen: {},
      };
      const filename = "empty_grocery_list.txt";

      // Execute
      saveGroceryList(categorizedIngredients, filename);

      // Verify
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        filename,
        expect.stringContaining(
          "Grocery List (Categorized by Woolworths Section):"
        )
      );
      const savedContent = fs.writeFileSync.mock.calls[0][1];
      expect(savedContent).toContain("Meat:");
      expect(savedContent).toContain("None");
      expect(savedContent).toContain("Dairy:");
      expect(savedContent).toContain("None");
      expect(savedContent).toContain("Aisles:");
      expect(savedContent).toContain("None");
      expect(savedContent).toContain("Veg:");
      expect(savedContent).toContain("None");
      expect(savedContent).toContain("Frozen:");
      expect(savedContent).toContain("None");
    });
  });
});
