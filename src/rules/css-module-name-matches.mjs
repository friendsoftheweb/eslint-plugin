import path from 'node:path';
import fs from 'node:fs';

/** @type {import('eslint').JSRuleDefinition} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        "enforce that a CSS module's filename matches the filename of the importing file",
    },
    schema: [],
    messages: {
      filenameMismatch:
        'CSS module filename "{{cssModuleFilename}}" does not match the current filename "{{filename}}"',
    },
  },
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
