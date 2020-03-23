module.exports = {
  preset: 'ts-jest',
  displayName: 'Vuex ORM Soft Delete',
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text-summary', 'clover'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.cjs.ts',
    '!src/config/**/*.ts'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^test/(.*)$': '<rootDir>/test/$1'
  },
  rootDir: __dirname,
  testMatch: ['<rootDir>/test/**/*.spec.ts?(x)'],
  testPathIgnorePatterns: ['/node_modules/']
}
