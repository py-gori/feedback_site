module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:react/recommended',
    'airbnb',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    // 'react',
    'react-hooks',
    '@typescript-eslint',
  ],
  rules: {
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    'import/no-unresolved': 'off',
    'import/extensions': [0],
    'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
    'arrow-body-style': [0],
    'array-callback-return': [0],
    'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
    'jsx-a11y/label-has-associated-control': ['error', {
      required: {
        some: ['nesting', 'id'],
      },
    }],
    'react/jsx-props-no-spreading': [0],
    'jsx-a11y/click-events-have-key-events': [0],
  },
  overrides: [
    {
      files: ['*ts', '*.tsx'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
};
