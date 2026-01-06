import js from '@eslint/js';
import eslintPlugin from 'eslint-plugin-eslint-plugin';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  {
    ignores: ['.yarn/**', 'dist/**', 'node_modules/**'],
  },
  {
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  eslintPlugin.configs.recommended,
  js.configs.recommended,
  {
    rules: {
      'eslint-plugin/require-meta-docs-description': 'error',
      'no-undef': ['error', { typeof: true }],
    },
  },
]);
