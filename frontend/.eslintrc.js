module.exports = {
    env: {
      node: true,  // Enable Node.js global variables
      es2021: true,  // Use modern JavaScript features
    },
    extends: [
      'eslint:recommended',
      'plugin:node/recommended', // Add Node plugin
    ],
    parserOptions: {
      ecmaVersion: 12,  // Set the ECMAScript version
    },
    rules: {
      'no-undef': 'off',  // Disable the no-undef rule, so it doesn't flag process
    },
  };
  