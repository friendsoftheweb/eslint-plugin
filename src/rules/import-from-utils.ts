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
        'The "{{functionName}}" function must be imported from "@friendsoftheweb/utils"',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node) {
        if (
          typeof node.source.value !== 'string' ||
          node.source.value === '@friendsoftheweb/utils'
        ) {
          return;
        }

        let functionName: string | null = null;

        for (const specifier of node.specifiers) {
          if (
            specifier.type === 'ImportSpecifier' &&
            specifier.imported.type === 'Identifier' &&
            functionNames.includes(specifier.imported.name)
          ) {
            functionName = specifier.imported.name;

            break;
          }
        }

        if (functionName == null) {
          return;
        }

        context.report({
          node,
          messageId: 'invalidImport',
          data: {
            functionName,
          },
          fix(fixer) {
            if (typeof node.source.value !== 'string') {
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
