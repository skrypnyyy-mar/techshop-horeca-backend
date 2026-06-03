module.exports = {
  testEnvironment: 'node',
  verbose: true,
  setupFiles: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/*.test.js'],
  modulePathIgnorePatterns: ['<rootDir>/node_modules/'],
};
