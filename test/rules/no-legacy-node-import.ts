import noLegacyNodeImport from '../../src/rules/no-legacy-node-import.ts';
import { ruleTester } from '../support.ts';

ruleTester.run('no-legacy-node-import', noLegacyNodeImport, {
  valid: [
    {
      filename: 'file.ts',
      code: `import fs from 'node:fs';`,
    },
    {
      filename: 'file.ts',
      code: `import fs from 'node:fs/promises';`,
    },
    {
      filename: 'file.ts',
      code: `import path from 'node:path';`,
    },
    {
      filename: 'file.ts',
      code: `import { readFile } from 'node:fs';`,
    },
    {
      filename: 'file.ts',
      code: `import * as os from 'node:os';`,
    },
    {
      filename: 'file.ts',
      code: `import crypto from 'node:crypto';`,
    },
    {
      filename: 'file.ts',
      code: `import util from 'node:util';`,
    },
    // Non-Node standard modules should not be affected
    {
      filename: 'file.ts',
      code: `import lodash from 'lodash';`,
    },
    {
      filename: 'file.ts',
      code: `import React from 'react';`,
    },
    {
      filename: 'file.ts',
      code: `import './local-module';`,
    },
    {
      filename: 'file.ts',
      code: `import '../relative-module';`,
    },
  ],
  invalid: [
    {
      filename: 'file.ts',
      code: `import fs from 'fs';`,
      output: `import fs from 'node:fs';`,
      errors: [
        {
          messageId: 'invalidImport',
        },
      ],
    },
    {
      filename: 'file.ts',
      code: `import fs from 'fs/promises';`,
      output: `import fs from 'node:fs/promises';`,
      errors: [
        {
          messageId: 'invalidImport',
        },
      ],
    },
    {
      filename: 'file.ts',
      code: `import path from 'path';`,
      output: `import path from 'node:path';`,
      errors: [
        {
          messageId: 'invalidImport',
        },
      ],
    },
    {
      filename: 'file.ts',
      code: `import { readFile, writeFile } from 'fs';`,
      output: `import { readFile, writeFile } from 'node:fs';`,
      errors: [
        {
          messageId: 'invalidImport',
        },
      ],
    },
    {
      filename: 'file.ts',
      code: `import * as crypto from 'crypto';`,
      output: `import * as crypto from 'node:crypto';`,
      errors: [
        {
          messageId: 'invalidImport',
        },
      ],
    },
    {
      filename: 'file.ts',
      code: `import util from 'util';`,
      output: `import util from 'node:util';`,
      errors: [
        {
          messageId: 'invalidImport',
        },
      ],
    },
    {
      filename: 'file.ts',
      code: `import os from 'os';`,
      output: `import os from 'node:os';`,
      errors: [
        {
          messageId: 'invalidImport',
        },
      ],
    },
    {
      filename: 'file.ts',
      code: `import buffer from 'buffer';`,
      output: `import buffer from 'node:buffer';`,
      errors: [
        {
          messageId: 'invalidImport',
        },
      ],
    },
    {
      filename: 'file.ts',
      code: `import child_process from 'child_process';`,
      output: `import child_process from 'node:child_process';`,
      errors: [
        {
          messageId: 'invalidImport',
        },
      ],
    },
    // Test that quote style is preserved
    {
      filename: 'file.ts',
      code: `import fs from "fs";`,
      output: `import fs from "node:fs";`,
      errors: [
        {
          messageId: 'invalidImport',
        },
      ],
    },
  ],
});
