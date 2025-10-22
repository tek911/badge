import tseslint from 'typescript-eslint';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: ['./tsconfig.base.json'],
      },
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  prettier,
);
