import banLodashImport from './rules/ban-lodash-import.mjs';
import cssModuleNameMatchesRule from './rules/css-module-name-matches.mjs';
import cssModuleClassExistsRule from './rules/css-module-class-exists.mjs';
import validServerActionsPathRule from './rules/valid-server-actions-path.mjs';

/** @type {import('eslint').ESLint.Plugin} */
const plugin = {
  meta: {
    name: '@friendsoftheweb/eslint-plugin',
    version: '0.0.1',
  },
  configs: {},
  rules: {
    'ban-lodash-import': banLodashImport,
    'css-module-name-matches': cssModuleNameMatchesRule,
    'css-module-class-exists': cssModuleClassExistsRule,
    'valid-server-actions-path': validServerActionsPathRule,
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
        'friendsoftheweb/ban-lodash-import': 'error',
        'friendsoftheweb/css-module-name-matches': 'error',
        'friendsoftheweb/css-module-class-exists': 'error',
        'friendsoftheweb/valid-server-actions-path': 'error',
      },
    },
  ],

  // eslintrc format
  recommended: {
    plugins: { friendsoftheweb: plugin },
    rules: {
      'friendsoftheweb/ban-lodash-import': 'error',
      'friendsoftheweb/css-module-name-matches': 'error',
      'friendsoftheweb/css-module-class-exists': 'error',
      'friendsoftheweb/valid-server-actions-path': 'error',
    },
  },
});

export default plugin;
