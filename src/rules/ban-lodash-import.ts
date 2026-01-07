import type { RuleModule } from '@typescript-eslint/utils/ts-eslint';

const banLodashImportRule: RuleModule<'invalidImport'> = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        'enforce importing functions from `lodash-es` instead of `lodash`',
      url: 'https://github.com/friendsoftheweb/eslint-plugin#friendsofthewebban-lodash-import',
    },
    schema: [],
    messages: {
      invalidImport:
        'Functions must be imported from "lodash-es" instead of "lodash"',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node) {
        if (
          typeof node.source.value !== 'string' ||
          (node.source.value !== 'lodash' &&
            !node.source.value.startsWith('lodash/'))
        ) {
          return;
        }

        context.report({
          node,
          messageId: 'invalidImport',
          fix(fixer) {
            if (typeof node.source.value !== 'string') {
              return null;
            }

            if (node.source.value === 'lodash/fp') {
              return null; // no automatic fix for fp imports
            }

            const newImportPath =
              node.source.value === 'lodash'
                ? 'lodash-es'
                : node.source.value.replace(/^lodash\//, 'lodash-es/');

            const quote = node.source.raw[0]; // preserve original quote style

            return fixer.replaceText(
              node.source,
              `${quote}${newImportPath}${quote}`,
            );
          },
        });
      },
    };
  },
};

export default banLodashImportRule;
