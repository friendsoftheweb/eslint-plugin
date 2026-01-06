import path from 'node:path';

/** @type {import('eslint').JSRuleDefinition} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'enforce server actions are exported from file paths that match "_actions.ts" or "_actions/**"',
    },
    schema: [],
    messages: {
      invalidPath:
        'Server action files must be located in a directory named "_actions" or have the filename "_actions.ts"',
    },
  },
  create(context) {
    return {
      ExpressionStatement(node) {
        if (
          node.expression.type !== 'Literal' ||
          node.expression.value !== 'use server'
        ) {
          return;
        }

        const basename = path.basename(context.filename);
        const dirname = path.dirname(context.filename);

        // Escape backslashes for RegExp (Windows paths)
        const escapedSep = path.sep.replace('\\', '\\\\');

        const isInActionsDir = new RegExp(
          `app(${escapedSep}.*)?${escapedSep}_actions`,
        ).test(dirname);

        const isActionsFile = basename.endsWith('_actions.ts');

        if (!isInActionsDir && !isActionsFile) {
          context.report({
            node,
            messageId: 'invalidPath',
          });
        }
      },
    };
  },
};
