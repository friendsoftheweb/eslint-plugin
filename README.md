# @friendsoftheweb/eslint-plugin

## Installation

```bash
yarn add -D @friendsoftheweb/eslint-plugin
```

## Rules

### `friendsoftheweb/ban-lodash-import`

Enforces importing functions from `lodash-es` instead of `lodash`.

This rule helps ensure tree shaking works properly by preferring ES module
imports from `lodash-es` over CommonJS imports from `lodash`.

#### Examples

❌ **Incorrect:**

```javascript
import _ from 'lodash';
import { map } from 'lodash';
import debounce from 'lodash/debounce';
```

✅ **Correct:**

```javascript
import { map } from 'lodash-es';
import debounce from 'lodash-es/debounce';
```

**Note:** This rule provides automatic fixes for most cases, except for
`lodash/fp` imports which require manual migration.

### `friendsoftheweb/css-module-class-exists`

Enforces that class names used from an imported CSS module exist in the module
file.

### `friendsoftheweb/css-module-name-matches`

Enforces that a CSS module's filename matches the filename of the importing
file.

This rule ensures consistent naming conventions by requiring CSS module files to
have the same base name as the file importing them.

### `friendsoftheweb/valid-server-actions-path`

Enforces server actions are exported from file paths that match
`app/**/_actions.ts` or `app/**/_actions/**/*.ts`.

This rule helps maintain a consistent file structure for Next.js server actions
by ensuring they are placed in designated locations.

## Example Configurations

### Basic Example

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

### Example with React

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
