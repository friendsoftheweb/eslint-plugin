import packageJson from '../package.json' with { type: 'json' };

import banLodashImport from './rules/ban-lodash-import.mjs';
import cssModuleNameMatchesRule from './rules/css-module-name-matches.mjs';
import cssModuleClassExistsRule from './rules/css-module-class-exists.mjs';
import noLegacyNodeImport from './rules/no-legacy-node-import.mjs';
import validServerActionsPathRule from './rules/valid-server-actions-path.mjs';

/** @type {import('eslint').ESLint.Plugin} */
const plugin = {
  meta: {
    name: packageJson.name,
    version: packageJson.version,
  },
  configs: {},
  rules: {
    'ban-lodash-import': banLodashImport,
    'css-module-name-matches': cssModuleNameMatchesRule,
    'css-module-class-exists': cssModuleClassExistsRule,
    'no-legacy-node-import': noLegacyNodeImport,
    'valid-server-actions-path': validServerActionsPathRule,
  },
};

const RULE_NAMES = Object.keys(plugin.rules).map(
  (ruleName) => `friendsoftheweb/${ruleName}`,
);

/**
 * @param {'error' | 'warn'} reportLevel
 */
function buildConfig(reportLevel) {
  return {
    plugins: {
      friendsoftheweb: plugin,
    },
    rules: Object.fromEntries(
      RULE_NAMES.map((ruleName) => [ruleName, reportLevel]),
    ),
  };
}

Object.assign(plugin.configs, {
  'flat/recommended': [buildConfig('error')],
  'flat/migrate': [buildConfig('warn')],
  recommended: buildConfig('error'),
  migrate: buildConfig('warn'),
});

export default plugin;
