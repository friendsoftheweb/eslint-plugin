/** @type {import('eslint').JSRuleDefinition} */
export default {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        'enforce importing functions from `lodash-es` instead of `lodash`',
    },
    schema: [],
    messages: {
      invalidImport:
        'Functions must be imported from "lodash-es" instead of "lodash"',
    },
  },
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

            const newImportPath =
              node.source.value === 'lodash'
                ? 'lodash-es'
                : node.source.value.replace(/^lodash\//, 'lodash-es/');

            return fixer.replaceText(node.source, `"${newImportPath}"`);
          },
        });
      },
    };
  },
};
