import packageJson from '../package.json' with { type: 'json' };

import banLodashImport from './rules/ban-lodash-import.ts';
import cssModuleNameMatchesRule from './rules/css-module-name-matches.ts';
import cssModuleClassExistsRule from './rules/css-module-class-exists.ts';
import noLegacyNodeImport from './rules/no-legacy-node-import.ts';
import reactNamedFuncComponents from './rules/react-named-func-components.ts';
import validServerActionsPathRule from './rules/valid-server-actions-path.ts';

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
    'react-named-func-components': reactNamedFuncComponents,
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

const errorConfig = buildConfig('error');
const warnConfig = buildConfig('warn');

const futureConfig = {
  ...errorConfig,
  rules: {
    ...errorConfig.rules,
    'friendsoftheweb/react-named-func-components': 'warn',
  },
};

const recommendedConfig = {
  ...errorConfig,
  rules: {
    ...errorConfig.rules,
    'friendsoftheweb/react-named-func-components': 'off',
  },
};

const migrateConfig = {
  ...warnConfig,
  rules: {
    ...warnConfig.rules,
    'friendsoftheweb/react-named-func-components': 'off',
  },
};

Object.assign(plugin.configs, {
  'flat/future': [futureConfig],
  'flat/recommended': [recommendedConfig],
  'flat/migrate': [migrateConfig],
  future: futureConfig,
  recommended: recommendedConfig,
  migrate: migrateConfig,
});

export default plugin;
