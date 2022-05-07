module.exports = {
  parser: '@typescript-eslint/parser',
  // parserOptions: {
  //   project: './tsconfig.json',
  //   sourceType: 'module',
  // },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:@typescript-eslint/recommended'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-await-in-loop': 'error',
  },
};

