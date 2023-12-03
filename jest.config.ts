import type { Config } from "@jest/types";

export const config: Config.InitialOptions = {
  preset: "ts-jest",
  clearMocks: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["<rootDir>/src/test-utils"],
  testMatch: ["<rootDir>/src/**/*.test.(ts|tsx)"],
  setupFiles: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
};

export default config;
