import type { TSESTree } from '@typescript-eslint/utils';
import type { RuleModule } from '@typescript-eslint/utils/ts-eslint';

const banChalkRule: RuleModule<'invalidImport' | 'invalidUsage'> = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        'enforce using `styleText` from `node:util` instead of `chalk`',
      url: 'https://github.com/friendsoftheweb/eslint-plugin#friendsofthewebban-chalk',
    },
    schema: [],
    messages: {
      invalidImport: 'Import `styleText` from `node:util` instead of `chalk`',
      invalidUsage:
        'Use `styleText` from `node:util` instead of `chalk`',
    },
  },
  defaultOptions: [],
  create(context) {
    const chalkNames = new Set<string>();

    return {
      ImportDeclaration(node) {
        if (node.source.value !== 'chalk') {
          return;
        }

        const defaultSpecifier = node.specifiers.find(
          (s) => s.type === 'ImportDefaultSpecifier',
        );

        if (defaultSpecifier != null) {
          chalkNames.add(defaultSpecifier.local.name);
        }

        context.report({
          node,
          messageId: 'invalidImport',
          fix(fixer) {
            if (
              node.specifiers.length !== 1 ||
              node.specifiers[0].type !== 'ImportDefaultSpecifier'
            ) {
              return null;
            }

            const quote = node.source.raw[0];

            return fixer.replaceText(
              node,
              `import { styleText } from ${quote}node:util${quote};`,
            );
          },
        });
      },

      CallExpression(node) {
        const chain = getChalkChain(node.callee, chalkNames);

        if (chain == null) {
          return;
        }

        context.report({
          node,
          messageId: 'invalidUsage',
          fix(fixer) {
            if (chain.length === 0 || node.arguments.length !== 1) {
              return null;
            }

            const [arg] = node.arguments;

            if (arg.type === 'SpreadElement') {
              return null;
            }

            const argSource = context.sourceCode.getText(arg);

            const formatArg =
              chain.length === 1
                ? `'${chain[0]}'`
                : `[${chain.map((c) => `'${c}'`).join(', ')}]`;

            return fixer.replaceText(
              node,
              `styleText(${formatArg}, ${argSource})`,
            );
          },
        });
      },
    };
  },
};

function getChalkChain(
  node: TSESTree.Node,
  chalkNames: Set<string>,
): string[] | null {
  if (node.type === 'Identifier' && chalkNames.has(node.name)) {
    return [];
  }

  if (
    node.type === 'MemberExpression' &&
    !node.computed &&
    node.property.type === 'Identifier'
  ) {
    const chain = getChalkChain(node.object, chalkNames);

    if (chain != null) {
      return [...chain, node.property.name];
    }
  }

  return null;
}

export default banChalkRule;
