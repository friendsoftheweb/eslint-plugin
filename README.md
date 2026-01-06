# @friendsoftheweb/eslint-plugin

## Installation

```bash
yarn add -D @friendsoftheweb/eslint-plugin
```

## Example Configurations

## Basic Example

```javascript
import friendsOfTheWeb from '@friendsoftheweb/eslint-plugin';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  { ignores: ['.yarn/**/*'] },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [
      tseslint.configs.recommended,
      friendsOfTheWeb.configs['flat/recommended'],
    ],
  },
]);
```

## Example with React

```javascript
import friendsOfTheWeb from '@friendsoftheweb/eslint-plugin';
import react from 'eslint-plugin-react';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  { ignores: ['.yarn/**/*'] },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [
      tseslint.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat.recommended,
      reactCompiler.configs.recommended,
      friendsOfTheWeb.configs['flat/recommended'],
    ],
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]);
```
