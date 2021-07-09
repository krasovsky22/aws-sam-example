module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.aws-sam', '<rootDir>/__tests__/helpers.ts'],
  moduleNameMapper: {
    '^@handlers(.*)$': '<rootDir>/src/handlers$1',
    '^@utils(.*)$': '<rootDir>/src/utils$1',
  },
};
