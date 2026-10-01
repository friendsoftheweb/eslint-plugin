import { builtinModules } from 'node:module';

import type { RuleModule } from '@typescript-eslint/utils/ts-eslint';

const NODE_BUILTIN_MODULES = new Set(builtinModules);

type Options = [{ allow?: string[] }?];

function getPackageName(source: string): string {
  const [scope, name] = source.split('/');

  return source.startsWith('@') ? `${scope}/${name}` : scope;
}

function isPackageImport(source: string): boolean {
  if (source.startsWith('.') || source.startsWith('/')) {
    return false;
  }

  if (source.startsWith('node:')) {
    return false;
  }

  return !NODE_BUILTIN_MODULES.has(source);
}

const noNamespaceImportRule: RuleModule<'namespaceImport', Options> = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow namespace imports (`import * as X`) from node modules',
      url: 'https://github.com/friendsoftheweb/eslint-plugin#friendsofthewebno-namespace-import',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      namespaceImport:
        'Namespace imports from "{{source}}" are not allowed. Use named or default imports instead.',
    },
  },
  defaultOptions: [{}],
  create(context) {
    const allow = new Set(context.options[0]?.allow ?? []);

    return {
      ImportDeclaration(node) {
        const source = node.source.value;

        if (typeof source !== 'string' || node.importKind === 'type') {
          return;
        }

        if (
          !node.specifiers.some((s) => s.type === 'ImportNamespaceSpecifier')
        ) {
          return;
        }

        if (!isPackageImport(source)) {
          return;
        }

        // Allow-list entries match the package name or the exact import path
        if (allow.has(source) || allow.has(getPackageName(source))) {
          return;
        }

        context.report({
          node,
          messageId: 'namespaceImport',
          data: { source },
        });
      },
    };
  },
};

export default noNamespaceImportRule;
