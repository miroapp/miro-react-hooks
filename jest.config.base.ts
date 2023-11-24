import type { Config } from '@jest/types';

export const baseJestConfig: Config.InitialOptions = {
  preset: "ts-jest",
  clearMocks: true,
  coverageDirectory: "coverage",
  testMatch: ["<rootDir>/src/**/*.test.(ts|tsx)"],
  setupFiles: ["<rootDir>/jest.setup.ts"],
};
