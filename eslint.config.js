import { defineConfig } from 'eslint/config';
import eslintPlugin from 'eslint-plugin-eslint-plugin';

export default defineConfig([
  {
    ignores: ['.yarn/**', 'node_modules/**'],
  },
  eslintPlugin.configs['flat/recommended'],
  {
    rules: {
      'eslint-plugin/require-meta-docs-description': 'error',
    },
  },
]);
