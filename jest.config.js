/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  // coverageThreshold: {
  //   global: {
  //     statements: 100,
  //   },
  // },
  transformIgnorePatterns: [
    "node_modules/(?!is-url-superb)"
  ],
};
