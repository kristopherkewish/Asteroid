const { readCSV } = require("../../src/utils/csvUtils");
const fs = require("fs");
const { parse } = require("csv-parse/sync");

// Mock fs and csv-parse
jest.mock("fs");
jest.mock("csv-parse/sync");

describe("csvUtils", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("readCSV", () => {
    it("should read and parse a CSV file", () => {
      // Setup
      const mockFileContent = "header1,header2\nvalue1,value2";
      const mockParsedData = [{ header1: "value1", header2: "value2" }];

      fs.readFileSync.mockReturnValue(mockFileContent);
      parse.mockReturnValue(mockParsedData);

      // Execute
      const result = readCSV("test.csv");

      // Verify
      expect(fs.readFileSync).toHaveBeenCalledWith("test.csv", "utf-8");
      expect(parse).toHaveBeenCalledWith(mockFileContent, {
        columns: true,
        skip_empty_lines: true,
      });
      expect(result).toEqual(mockParsedData);
    });

    it("should throw an error if file reading fails", () => {
      // Setup
      fs.readFileSync.mockImplementation(() => {
        throw new Error("File not found");
      });

      // Execute and Verify
      expect(() => readCSV("nonexistent.csv")).toThrow("File not found");
    });
  });
});
