import fs from 'node:fs';

const { name, version } = JSON.parse(
  fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
);

import cssModuleNameMatchesRule from './rules/css-module-name-matches.js';
import cssModuleClassExistsRule from './rules/css-module-class-exists.js';

/** @type {import('eslint').ESLint.Plugin} */
const plugin = {
  meta: {
    name,
    version,
  },
  configs: {},
  rules: {
    'css-module-name-matches': cssModuleNameMatchesRule,
    'css-module-class-exists': cssModuleClassExistsRule,
  },
};

Object.assign(plugin.configs, {
  // flat config format
  'flat/recommended': [
    {
      plugins: {
        friendsoftheweb: plugin,
      },
      rules: {
        'friendsoftheweb/css-module-name-matches': 'error',
        'friendsoftheweb/css-module-class-exists': 'error',
      },
    },
  ],

  // eslintrc format
  recommended: {
    plugins: { friendsoftheweb: plugin },
    rules: {
      'friendsoftheweb/css-module-name-matches': 'error',
      'friendsoftheweb/css-module-class-exists': 'error',
    },
  },
});

export default plugin;
