import noNamespaceImport from '../../src/rules/no-namespace-import.ts';
import { ruleTester } from '../support.ts';

ruleTester.run('no-namespace-import', noNamespaceImport, {
  valid: [
    { filename: 'file.ts', code: `import React from 'react';` },
    { filename: 'file.ts', code: `import { useState } from 'react';` },
    { filename: 'file.ts', code: `import 'side-effect';` },
    // Relative imports are not node modules
    { filename: 'file.ts', code: `import * as utils from './utils';` },
    { filename: 'file.ts', code: `import * as utils from '../utils';` },
    // Node standard library is not a node module
    { filename: 'file.ts', code: `import * as fs from 'node:fs';` },
    { filename: 'file.ts', code: `import * as path from 'path';` },
    // Type-only namespace imports are erased
    { filename: 'file.ts', code: `import type * as Types from 'some-lib';` },
    // Allowed libraries
    {
      filename: 'file.ts',
      code: `import * as React from 'react';`,
      options: [{ allow: ['react'] }],
    },
    {
      filename: 'file.ts',
      code: `import * as fp from 'lodash/fp';`,
      options: [{ allow: ['lodash'] }],
    },
    {
      filename: 'file.ts',
      code: `import * as Sentry from '@sentry/node';`,
      options: [{ allow: ['@sentry/node'] }],
    },
    {
      filename: 'file.ts',
      code: `import * as x from '@scope/pkg/sub';`,
      options: [{ allow: ['@scope/pkg'] }],
    },
    {
      filename: 'file.ts',
      code: `import * as x from 'pkg/sub';`,
      options: [{ allow: ['pkg/sub'] }],
    },
  ],
  invalid: [
    {
      filename: 'file.ts',
      code: `import * as React from 'react';`,
      errors: [{ messageId: 'namespaceImport', data: { source: 'react' } }],
    },
    {
      filename: 'file.ts',
      code: `import Foo, * as Bar from 'foo';`,
      errors: [{ messageId: 'namespaceImport' }],
    },
    {
      filename: 'file.ts',
      code: `import * as Sentry from '@sentry/node';`,
      errors: [{ messageId: 'namespaceImport' }],
    },
    {
      filename: 'file.ts',
      code: `import * as fp from 'lodash/fp';`,
      options: [{ allow: ['react'] }],
      errors: [{ messageId: 'namespaceImport' }],
    },
    {
      filename: 'file.ts',
      code: `import * as x from 'pkg/other';`,
      options: [{ allow: ['pkg/sub'] }],
      errors: [{ messageId: 'namespaceImport' }],
    },
  ],
});
