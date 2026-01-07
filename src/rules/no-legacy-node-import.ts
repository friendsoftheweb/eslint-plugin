import type { RuleModule } from '@typescript-eslint/utils/ts-eslint';

const noLegacyNodeImportRule: RuleModule<'invalidImport'> = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        'enforce importing node standard library modules using `node:` prefix',
      url: 'https://github.com/friendsoftheweb/eslint-plugin#friendsofthewebno-legacy-node-import',
    },
    schema: [],
    messages: {
      invalidImport:
        'Node standard library modules must be imported using the "node:" prefix',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node) {
        if (
          typeof node.source.value !== 'string' ||
          !NODE_STANDARD_MODULES.includes(node.source.value)
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

            const newImportPath = `node:${node.source.value}`;
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

export default noLegacyNodeImportRule;

export const NODE_STANDARD_MODULES = Object.freeze([
  'assert',
  'assert/strict',
  'async_hooks',
  'buffer',
  'child_process',
  'cluster',
  'console',
  'crypto',
  'dns',
  'dns/promises',
  'domain',
  'events',
  'fs',
  'fs/promises',
  'http',
  'http2',
  'https',
  'inspector',
  'module',
  'net',
  'os',
  'path',
  'perf_hooks',
  'process',
  'punycode',
  'querystring',
  'readline',
  'readline/promises',
  'repl',
  'sqlite',
  'stream',
  'stream/promises',
  'string_decoder',
  'test',
  'timers',
  'timers/promises',
  'tls',
  'trace_events',
  'tty',
  'url',
  'util',
  'util/types',
  'v8',
  'vm',
  'wasi',
  'worker_threads',
  'zlib',
]);
