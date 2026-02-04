import type { RuleModule } from '@typescript-eslint/utils/ts-eslint';

export const functionNames = [
  'buildContentDispositionHeader',
  'createCSVStream',
  'deepCamelCaseKeys',
  'deepPascalCaseKeys',
  'deepSnakeCaseKeys',
  'deepTransformKeys',
  'formatDateForDateInput',
  'formatDateForDateTimeInput',
  'formatDuration',
  'formatFileSize',
  'isPresent',
  'isPresentNumber',
  'isPresentString',
  'parseNullableDate',
  'parseNullableFloat',
  'parseNullableInt',
  'presence',
  'slugify',
];

const importFromUtils: RuleModule<'invalidImport'> = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        'enforce importing util functions from `@friendsoftheweb/utils`',
      url: 'https://github.com/friendsoftheweb/eslint-plugin#friendsofthewebimport-from-utils',
    },
    schema: [],
    messages: {
      invalidImport:
        '{{functionNames}} must be imported from "@friendsoftheweb/utils"',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.importKind === 'type') {
          return;
        }

        if (
          typeof node.source.value !== 'string' ||
          node.source.value === '@friendsoftheweb/utils'
        ) {
          return;
        }

        const foundFunctionNames: string[] = [];

        for (const specifier of node.specifiers) {
          if (
            specifier.type === 'ImportSpecifier' &&
            specifier.importKind !== 'type' &&
            specifier.imported.type === 'Identifier' &&
            functionNames.includes(specifier.imported.name)
          ) {
            foundFunctionNames.push(specifier.imported.name);
          }
        }

        if (foundFunctionNames.length === 0) {
          return;
        }

        context.report({
          node,
          messageId: 'invalidImport',
          data: {
            functionNames: foundFunctionNames
              .map((name) => `"${name}"`)
              .join(', '),
          },
          fix(fixer) {
            if (typeof node.source.value !== 'string') {
              return null;
            }

            if (foundFunctionNames.length < node.specifiers.length) {
              // Don't auto-fix if there are other imports that would be affected
              return null;
            }

            const newImportPath = '@friendsoftheweb/utils';
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

export default importFromUtils;
