import importFromUtils from '../../src/rules/import-from-utils.ts';
import { ruleTester } from '../support.ts';

ruleTester.run('import-from-utils', importFromUtils, {
  valid: [
    {
      filename: 'file.ts',
      code: `import { parseNullableInt } from '@friendsoftheweb/utils';`,
    },
  ],
  invalid: [
    {
      filename: 'file.ts',
      code: `import { parseNullableInt } from 'src/utils/parseNullableInt';`,
      output: `import { parseNullableInt } from '@friendsoftheweb/utils';`,
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            functionNames: `"parseNullableInt"`,
          },
        },
      ],
    },
    {
      filename: 'file.ts',
      code: `import { parseNullableInt, parseNullableFloat } from 'src/utils';`,
      output: `import { parseNullableInt, parseNullableFloat } from '@friendsoftheweb/utils';`,
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            functionNames: `"parseNullableInt", "parseNullableFloat"`,
          },
        },
      ],
    },
    {
      filename: 'file.ts',
      code: `import { parseNullableInt, unknownImport } from 'src/utils';`,
      output: null,
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            functionNames: `"parseNullableInt"`,
          },
        },
      ],
    },
  ],
});
