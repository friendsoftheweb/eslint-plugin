import importFromUtils, {
  functionNames,
} from '../../src/rules/import-from-utils.ts';
import { ruleTester } from '../support.ts';

ruleTester.run('import-from-utils', importFromUtils, {
  valid: [
    {
      filename: 'file.ts',
      code: `import { parseNullableInt } from '@friendsoftheweb/utils';`,
    },
  ],
  invalid: functionNames.map((functionName) => ({
    filename: 'file.ts',
    code: `import { ${functionName} } from 'src/utils/${functionName}';`,
    output: `import { ${functionName} } from '@friendsoftheweb/utils';`,
    errors: [
      {
        messageId: 'invalidImport',
        data: {
          functionName,
        },
      },
    ],
  })),
});
