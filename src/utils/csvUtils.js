const fs = require("fs");
const { parse } = require("csv-parse/sync");

/**
 * Reads and parses a CSV file
 * @param {string} filePath - Path to the CSV file
 * @returns {Array} Parsed CSV data
 */
function readCSV(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });
}

module.exports = {
  readCSV,
};
