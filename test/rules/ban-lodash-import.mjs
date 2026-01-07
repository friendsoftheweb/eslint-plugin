import banLodashImport from '../../src/rules/ban-lodash-import.mjs';
import { ruleTester } from '../support.mjs';

ruleTester.run('ban-lodash-import', banLodashImport, {
  valid: [
    {
      filename: 'file.ts',
      code: `import { map } from 'lodash-es';`,
    },
    {
      filename: 'file.ts',
      code: `import map from 'lodash-es/map';`,
    },
  ],
  invalid: [
    {
      filename: 'file.ts',
      code: `import { map } from "lodash";`,
      output: `import { map } from "lodash-es";`,
      errors: 1,
    },
    {
      filename: 'file.ts',
      code: `import { map } from 'lodash';`,
      output: `import { map } from 'lodash-es';`,
      errors: 1,
    },
    {
      filename: 'file.ts',
      code: `import _ from "lodash";`,
      output: `import _ from "lodash-es";`,
      errors: 1,
    },
    {
      filename: 'file.ts',
      code: `import map from "lodash/map";`,
      output: `import map from "lodash-es/map";`,
      errors: 1,
    },
    {
      filename: 'file.ts',
      code: `import fp from "lodash/fp";`,
      output: null,
      errors: 1,
    },
    {
      filename: 'file.ts',
      code: `import * as lodash from "lodash";`,
      output: `import * as lodash from "lodash-es";`,
      errors: 1,
    },
  ],
});
