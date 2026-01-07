/** @type {import('eslint').JSRuleDefinition} */
export default {
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

export const NODE_STANDARD_MODULES = Object.freeze([
  'assert',
  'buffer',
  'child_process',
  'cluster',
  'console',
  'crypto',
  'dgram',
  'dns',
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
  'repl',
  'stream',
  'string_decoder',
  'timers',
  'tls',
  'trace_events',
  'tty',
  'url',
  'util',
  'v8',
  'vm',
  'worker_threads',
  'zlib',
]);
