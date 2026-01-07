import path from 'node:path';

import type { RuleModule } from '@typescript-eslint/utils/ts-eslint';

const cssModuleNameMatchesRule: RuleModule<'filenameMismatch'> = {
  meta: {
    type: 'problem',
    docs: {
      description:
        "enforce that a CSS module's filename matches the filename of the importing file",
      url: 'https://github.com/friendsoftheweb/eslint-plugin#friendsofthewebcss-module-name-matches',
    },
    schema: [],
    messages: {
      filenameMismatch:
        'CSS module filename "{{cssModuleFilename}}" does not match the current filename "{{filename}}"',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node) {
        if (
          typeof node.source.value !== 'string' ||
          !node.source.value.endsWith('.module.css')
        ) {
          return;
        }

        const filename = path.basename(
          context.filename,
          path.extname(context.filename),
        );

        const cssModulePath = node.source.value;
        const cssModuleFilename = path.basename(cssModulePath, '.module.css');

        if (cssModuleFilename !== filename) {
          context.report({
            node,
            messageId: 'filenameMismatch',
            data: {
              cssModuleFilename,
              filename,
            },
          });
        }
      },
    };
  },
};

export default cssModuleNameMatchesRule;
