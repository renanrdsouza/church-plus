const nextJest = require("next/jest");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const createJestConfig = nextJest({
  dir: ".",
});
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  clearMocks: true,
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/tests/singleton.ts"],
});

module.exports = jestConfig;
