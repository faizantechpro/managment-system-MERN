module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverageFrom: ['lib/**/*.ts'],
  coverageReporters: ['json', 'json-summary', 'text'],
  coverageDirectory: 'coverage/unit',
  moduleNameMapper: {
    '^lib/(.*)$': '<rootDir>/lib/$1',
  },
  testMatch: ['**/?(*.)(test).(j|t)s?(x)'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules', '/dist'],
};
