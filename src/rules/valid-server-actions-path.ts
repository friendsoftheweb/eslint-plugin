import path from 'node:path';

import type { RuleModule } from '@typescript-eslint/utils/ts-eslint';

const validServerActionsPathRule: RuleModule<'invalidPath'> = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'enforce server actions are exported from file paths that match "app/**/_actions.ts" or "app/**/_actions/**/*.ts"',
      url: 'https://github.com/friendsoftheweb/eslint-plugin#friendsofthewebvalid-server-actions-path',
    },
    schema: [],
    messages: {
      invalidPath:
        'Server action files must be located in a directory named "_actions" or have the filename "_actions.ts"',
    },
  },
  defaultOptions: [],
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

        const isActionsFile =
          (dirname === 'app' || new RegExp(`app${escapedSep}`).test(dirname)) &&
          /_actions\.(js|ts)$/.test(basename);

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

export default validServerActionsPathRule;
